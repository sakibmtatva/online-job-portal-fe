import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { Skill } from "../utility/interface/ISkillResponse";
import { IResponse } from "../utility/interface/IResponse";

const endPointBaseURL = `/api`;

const getSkillsData = async (): Promise<AxiosResponse<IResponse<Skill[]>>> =>
  httpClient.get<IResponse<Skill[]>>(`${endPointBaseURL}/skills`, {
    skipToast: true,
  });

export default {
  getSkillsData,
};
