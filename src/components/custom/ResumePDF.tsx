import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#f3f4f6", // Tailwind's gray-100
        padding: 24,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    container: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb", // gray-200
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    header: {
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "#b91c1c", // red-700
        marginBottom: 10,
        paddingBottom: 6,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#b91c1c",
    },
    jobTitle: {
        fontSize: 14,
        color: "#374151", // gray-700
        marginBottom: 2,
    },
    address: {
        fontSize: 10,
        color: "#6b7280", // gray-500
    },
    contact: {
        flexDirection: "row",
        justifyContent: "space-between",
        color: "#b91c1c",
        fontSize: 10,
        marginTop: 4,
        marginBottom: 12,
    },
    section: {
        marginBottom: 16,
    },
    aboutText: {
        fontSize: 10,
        color: "#374151",
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: "semibold",
        color: "#b91c1c",
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "#fca5a5",
        paddingBottom: 4,
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#b91c1c",
    },
    subText: {
        fontSize: 10,
        color: "#374151",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 9,
        color: "#6b7280",
        marginBottom: 4,
    },
    bullet: {
        fontSize: 10,
        marginLeft: 10,
        marginBottom: 2,
    },
});

const ResumePDF = ({ resumeInfo }: any) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.name}>
                        {resumeInfo.fullName} {resumeInfo.lastName}
                    </Text>
                    <Text style={styles.jobTitle}>{resumeInfo.jobTitle}</Text>
                    <Text style={styles.address}>{resumeInfo.address}</Text>
                </View>

                <View style={styles.contact}>
                    <Text>{resumeInfo.phone}</Text>
                    <Text>{resumeInfo.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.aboutText}>{resumeInfo.about}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Professional Experience</Text>
                    {resumeInfo.professionalExperience?.map((exp: any, idx: number) => (
                        <View key={idx} style={{ marginBottom: 8 }}>
                            <Text style={styles.itemTitle}>{exp.positionTitle}</Text>
                            <Text style={styles.subText}>
                                {exp.city}, {exp.state}
                            </Text>
                            <Text style={styles.dateText}>
                                {exp.startDate} to {exp.endDate}
                            </Text>
                            <Text style={styles.bullet}>• {exp.summary}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Education</Text>
                    {resumeInfo.educationDetails?.map((edu: any, idx: number) => (
                        <View key={idx} style={{ marginBottom: 8 }}>
                            <Text style={styles.itemTitle}>{edu.university}</Text>
                            <Text style={styles.subText}>{edu.degree}</Text>
                            <Text style={styles.dateText}>
                                {edu.startDate} to {edu.endDate}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);

export default ResumePDF;
