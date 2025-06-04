import { CirclePlus, Download, Ellipsis, Pencil, Trash2 } from "lucide-react";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { useEffect, useRef, useState } from "react";
import AddColumnModal from "../../components/custom/ColumnAdd";
import { useParams } from "react-router-dom";
import viewapplicationService from "../../services/viewapplication-service";
import {
  Application,
  Column,
} from "../../utility/interface/IApplicationResponse";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import SkeletonColumn from "../../components/custom/Skeleton";
import CandidateOverviewModal from "../../components/custom/CandidateOverviewModal";

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
const JobApplication = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModel, setisEditModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationList, setApplicationList] = useState<Application[]>();
  const [column, setColumn] = useState<Column[]>([]);
  const { jobId } = useParams<{ jobId: string }>();
  const [openDeleteDialoag, setOpenDeleteDialoag] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [editingColumn, setEditingColumn] = useState<Column>({
    _id: "",
    name: "",
  });
  const [editCol, setEditColId] = useState("");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [application, setApplication] = useState<Application | null>(null);
  const getAllApplicationsByJobId = async (jobId: string) => {
    try {
      const response =
        await viewapplicationService.getAllApplicationsWithoutpage(jobId);
      setApplicationList(response?.data?.data);
    } catch (e) {
    } finally {
    }
  };
  const getAllColumn = async () => {
    try {
      setLoading(true);
      const response = await viewapplicationService.getColumn(jobId || "");
      setColumn(response?.data?.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const moveApplicationToColumn = (
    oldTrelloname: string,
    newTrelloName: string
  ) => {
    setApplicationList((prevList) =>
      prevList?.map((app) =>
        app.trello_name === oldTrelloname
          ? { ...app, trello_name: newTrelloName }
          : app
      )
    );
  };

  const handleSubmit = async (columnName: string) => {
    if (editingColumn._id !== "") {
      try {
        await viewapplicationService.editColumn(
          columnName,
          editingColumn._id,
          jobId || ""
        );
        moveApplicationToColumn(editingColumn.name, columnName);
        setEditingColumn({ _id: "", name: "" });
        await getAllColumn();
      } catch (e) {
      } finally {
        setModalOpen(false);
      }
    } else {
      try {
        await viewapplicationService.addColumn(columnName, jobId || "");
        await getAllColumn();
      } catch (e) {
      } finally {
        setModalOpen(false);
      }
    }
  };
  const handleConfirmDelete = async () => {
    try {
      await viewapplicationService.deleteColumn(editingColumn._id, jobId || "");
      setEditingColumn({ _id: "", name: "" });
      await getAllColumn();
      await getAllApplicationsByJobId(jobId || "");
    } catch (e) {
    } finally {
      setOpenDeleteDialoag(false);
    }
  };
  useEffect(() => {
    getAllColumn();
    if (jobId) {
      getAllApplicationsByJobId(jobId);
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setEditColId("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const staticColumns = [
    {
      _id: "static-all-application",
      name: "All Applications",
    },
    {
      _id: "static-shortlisted",
      name: "Shortlisted",
    },
  ];

  const allColumns = [...staticColumns, ...column];
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceColName = source.droppableId.toLowerCase();
    const destColName = destination.droppableId.toLowerCase();
    if (applicationList) {
      if (sourceColName === destColName) {
        const items = Array.from(
          applicationList.filter(
            (c) => c.trello_name.toLowerCase() === sourceColName
          )
        );
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        const updatedList = applicationList.map((candidate) => {
          if (candidate.trello_name.toLowerCase() === sourceColName) {
            return items.find((i) => i._id === candidate._id) || candidate;
          }
          return candidate;
        });

        setApplicationList(updatedList);
      } else {
        const draggedCandidate = applicationList.find(
          (c) => c._id === draggableId
        );
        const updatedList = applicationList.map((candidate) => {
          if (
            candidate.trello_name.toLowerCase() === sourceColName &&
            candidate._id === draggableId
          ) {
            return { ...candidate, trello_name: destination.droppableId };
          }
          return candidate;
        });

        setApplicationList(updatedList);
        if (draggedCandidate) {
          await viewapplicationService.changeColumn(
            draggedCandidate._id,
            destination.droppableId
          );
        }
      }
    }
  };
  return (
    <Layout>
      <div className="flex flex-row justify-between">
        <div className="font-medium text-xl">Job Application</div>
        <div
          onClick={() => {
            setModalOpen(true), setisEditModel(false);
          }}
          role="button"
          tabIndex={0}
          className="my-4 bg-[#F1F2F4CC] border border-[#E4E5E8] px-4 py-3 rounded-sm cursor-pointer focus:outline-none hover:bg-[#e9eaec] active:bg-[#dcdde1] transition duration-150 h-fit"
        >
          <div className="flex flex-row space-x-2 justify-center items-center h-fit">
            <CirclePlus className="text-[#0A65CC]" />
            <div className="font-medium text-[#0A65CC]">Create Column</div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-row gap-2 overflow-x-auto custom-scrollbar h-[calc(100%-82px)]">
          {[...Array(5)].map((_, index) => (
            <SkeletonColumn key={index} />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-row gap-2 overflow-x-auto custom-scrollbar h-[calc(100%-82px)]">
            {allColumns.map((col) => {
              const filteredCandidates = applicationList?.filter(
                (application) => application.trello_name === col.name
              );

              return (
                <Droppable droppableId={col.name} key={col._id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="my-4 bg-[#F1F2F480] border h-fit border-[#E4E5E8] px-4 py-3 rounded-sm min-w-85 relative"
                    >
                      {/* Column Header */}
                      <div className="flex flex-row justify-between items-center">
                        <div className="text-base font-medium">
                          {col.name}
                          {`(${filteredCandidates?.length})` || 0}
                        </div>
                        {col.name !== "All Applications" &&
                          col.name !== "Shortlisted" && (
                            <div className="flex items-center">
                              <button
                                onClick={() => {
                                  setEditingColumn({
                                    _id: col._id,
                                    name: col.name,
                                  });
                                  setEditColId(col._id);
                                }}
                                className="rounded hover:bg-gray-100"
                              >
                                <Ellipsis className="text-gray-400" />
                              </button>

                              {editCol === col._id && (
                                <div
                                  ref={menuRef}
                                  className="absolute right-0 mt-30 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                                >
                                  <ul className="py-1 text-sm text-gray-700">
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setModalOpen(true);
                                          setisEditModel(true);
                                        }}
                                        className="flex items-center gap-3 text-base font-medium w-full text-left px-4 py-2 hover:bg-gray-100"
                                      >
                                        <Pencil /> Edit Column
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation(),
                                            setOpenDeleteDialoag(true);
                                        }}
                                        className="flex items-center gap-3 text-base font-medium w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                      >
                                        <Trash2 /> Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                      {filteredCandidates?.map((candidate, index) => (
                        <Draggable
                          draggableId={candidate._id}
                          index={index}
                          key={candidate._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`border border-[#E4E5E8] bg-white px-4 py-3 my-3 rounded-sm shadow-2xs transition ${
                                snapshot.isDragging ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex flex-row space-x-5">
                                <div
                                  className={`h-12 w-12 rounded-full ${
                                    candidate.candidate[
                                      "candidate-profile-info"
                                    ].profile_url
                                      ? "bg-white"
                                      : "bg-[#767F8C]"
                                  }`}
                                >
                                  <img
                                    src={
                                      candidate.candidate[
                                        "candidate-profile-info"
                                      ].profile_url
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {candidate.candidate.full_name}
                                  </div>
                                  <div className="text-[#767F8C]">
                                    {candidate.candidate[
                                      "candidate-profile-info"
                                    ].position
                                      ? candidate.candidate[
                                          "candidate-profile-info"
                                        ].position
                                      : "Role Not Specified"}
                                  </div>
                                </div>
                              </div>

                              <div className="h-px bg-gray-300 my-4" />
                              <ul className="list-disc list-inside text-base text-[#5E6670] mx-1">
                                <li>
                                  {candidate.candidate["candidate-profile-info"]
                                    .total_experience
                                    ? candidate.candidate[
                                        "candidate-profile-info"
                                      ].total_experience
                                    : 0}{" "}
                                  Years Experience
                                </li>
                                <li>
                                  Education:{" "}
                                  {candidate.candidate["candidate-profile-info"]
                                    .education
                                    ? candidate.candidate[
                                        "candidate-profile-info"
                                      ].education
                                    : "Eduction is not mentioned"}
                                </li>
                                <li>
                                  Applied: {formatDate(candidate.applied_at)}
                                </li>
                              </ul>
                              <a
                                href={candidate.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex text-base text-[#0A65CC] font-medium my-3 items-center space-x-2"
                              >
                                <Download className="text-sm" />
                                <span>Download Cv</span>
                              </a>
                              <Button
                                onClick={() => {
                                  setShowProfile(true);
                                  setApplication(candidate);
                                }}
                                className="bg-blue-600 w-full hover:bg-blue-800"
                              >
                                View Candidate
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      )}
      <AddColumnModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false),
            setEditingColumn({
              _id: "",
              name: "",
            });
        }}
        isEdit={isEditModel}
        handleSubmit={handleSubmit}
        editingColumnId={editingColumn.name}
      />
      <Dialog
        open={openDeleteDialoag}
        onOpenChange={() => {
          setOpenDeleteDialoag(false),
            setEditingColumn({
              _id: "",
              name: "",
            });
        }}
      >
        <DialogPortal>
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[425px] gap-6">
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Confirm Delete
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-500">
                Are you sure you want to Delete This Column?
              </DialogDescription>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteDialoag(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto"
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {application && (
        <CandidateOverviewModal
          application={application}
          visible={showProfile}
          onClose={() => {
            setShowProfile(false);
            setApplication(null);
          }}
        />
      )}
    </Layout>
  );
};

export default JobApplication;
