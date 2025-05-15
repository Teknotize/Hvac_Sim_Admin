import { TabList, TabPanels, Tab, TabPanel, TabGroup } from "@headlessui/react";
import PageHeader from "../../components/layout/PageHeader";
import {
  getHomeHeaderData,
  getWhatsNew,
  updateHomeHeaderData,
  updateWhatsNewData,
} from "../../api/CmsApi"; // Adjust the path based on your project structure

import { useEffect, useState } from "react";

import HomeHeaderSection1 from "./homeheader/Section1";
import HomeHeaderSection2 from "./homeheader/Section2";
import HomeHeaderSection3 from "./homeheader/Section3";
import WhatsNewSection1 from "./whatsnext/Section1";
import WhatsNewSection2 from "./whatsnext/Section2";
import WhatsNewSection3 from "./whatsnext/Section3";
import useToastStore from "../../store/useToastStore";
import Loader from "../../components/loader";
import { set } from "date-fns";
interface SectionData {
  sec_heading: string;
  sec_link: string;
  sec_description: string;
  sec_image: File | string | null; // <-- important
}

interface WhatsNewDataType {
  section1: {
    sec1_heading: string;
    sec1_link: string;
    sec1_description: string;
    sec1_image: File | string | null;
  };
  section2: {
    sec2_heading: string;
    sec2_link: string;
    sec2_description: string;
    sec2_image: File | string | null;
  };
  section3: {
    sec3_heading: string;
    sec3_link: string;
    sec3_description: string;
    sec3_image: File | string | null;
  };
}

const Crm = () => {
  const [activeSectionHomeHeader, setactiveSectionHomeHeader] =
    useState("homeheadersection1");
  const [activeSectionWhatsNew, setactiveSectionWhatsNew] =
    useState("whatsnewsection1");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();
  const [fetchingdata, setFetchingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [homeHeaderData, setHomeHeaderData] = useState({
    section1: {
      sec1_heading1: "",
      sec1_heading2: "",
      sec1_description: "",
    },
    section2: {
      sec2_heading1: "",
      sec2_heading2: "",
      sec2_description: "",
    },
    section3: {
      sec3_heading1: "",
      sec3_heading2: "",
      sec3_description: "",
    },
  });

  const [whatsNewData, setWhatsNewData] = useState<WhatsNewDataType>({
    section1: {
      sec1_heading: "",
      sec1_link: "",
      sec1_description: "",
      sec1_image: null,
    },
    section2: {
      sec2_heading: "",
      sec2_link: "",
      sec2_description: "",
      sec2_image: null,
    },
    section3: {
      sec3_heading: "",
      sec3_link: "",
      sec3_description: "",
      sec3_image: null,
    },
  });

  const handleHomeHeaderChange = (
    section: keyof typeof homeHeaderData,
    field: string,
    value: any
  ) => {
    setHomeHeaderData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleWhatsNewChange = (
    section: keyof typeof whatsNewData,
    field: any,
    value: any
  ) => {
    setWhatsNewData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderSectionsHomeHeader = () => {
    switch (activeSectionHomeHeader) {
      case "homeheadersection1":
        return (
          <HomeHeaderSection1
            data={homeHeaderData.section1}
            onChange={(field: string, value: any) =>
              handleHomeHeaderChange("section1", field, value)
            }
          />
        );
      case "homeheadersection2":
        return (
          <HomeHeaderSection2
            data={homeHeaderData.section2}
            onChange={(field: string, value: any) =>
              handleHomeHeaderChange("section2", field, value)
            }
          />
        );
      case "homeheadersection3":
        return (
          <HomeHeaderSection3
            data={homeHeaderData.section3}
            onChange={(field: string, value: any) =>
              handleHomeHeaderChange("section3", field, value)
            }
          />
        );
      default:
        return null;
    }
  };
  const renderSectionsWhatsNext = () => {
    switch (activeSectionWhatsNew) {
      case "whatsnewsection1":
        return (
          <WhatsNewSection1
            data={whatsNewData.section1}
            onChange={(field: any, value: any) =>
              handleWhatsNewChange("section1", field, value)
            }
          />
        );
      case "whatsnewsection2":
        return (
          <WhatsNewSection2
            data={whatsNewData.section2}
            onChange={(field: any, value: any) =>
              handleWhatsNewChange("section2", field, value)
            }
          />
        );
      case "whatsnewsection3":
        return (
          <WhatsNewSection3
            data={whatsNewData.section3}
            onChange={(field: any, value: any) =>
              handleWhatsNewChange("section3", field, value)
            }
          />
        );
      default:
        return null;
    }
  };

  const saveHomeHeaderChanges = async () => {
    try {
      setLoading(true);
      const updatedData = await updateHomeHeaderData(homeHeaderData);
      setHomeHeaderData(updatedData);
      showToast("Home Header updated successfully!", "success");
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Failed to update home header:", error);
      showToast("Failed to update home header.", "error");
      setLoading(false);
    }
  };
  const saveWhatsNewChanges = async () => {
    const formData = new FormData();

    // SECTION 1
    formData.append(
      "section1.sec1_heading",
      whatsNewData.section1.sec1_heading
    );
    formData.append("section1.sec1_link", whatsNewData.section1.sec1_link);
    formData.append(
      "section1.sec1_description",
      whatsNewData.section1.sec1_description
    );
    if (
      typeof window !== "undefined" &&
      typeof File !== "undefined" &&
      whatsNewData.section1.sec1_image instanceof File
    ) {
      formData.append("section1.sec1_image", whatsNewData.section1.sec1_image);
    }

    // SECTION 2
    formData.append(
      "section2.sec2_heading",
      whatsNewData.section2.sec2_heading
    );
    formData.append("section2.sec2_link", whatsNewData.section2.sec2_link);
    formData.append(
      "section2.sec2_description",
      whatsNewData.section2.sec2_description
    );
    if (whatsNewData.section2.sec2_image instanceof File) {
      formData.append("section2.sec2_image", whatsNewData.section2.sec2_image);
    }

    // SECTION 3
    formData.append(
      "section3.sec3_heading",
      whatsNewData.section3.sec3_heading
    );
    formData.append("section3.sec3_link", whatsNewData.section3.sec3_link);
    formData.append(
      "section3.sec3_description",
      whatsNewData.section3.sec3_description
    );
    if (whatsNewData.section3.sec3_image instanceof File) {
      formData.append("section3.sec3_image", whatsNewData.section3.sec3_image);
    }

    try {
      setLoading(true);
      await updateWhatsNewData(formData);
      showToast("Whats New Updated successfully!", "success");
      setLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Update failed:", error);
      setLoading(false);
      showToast("Failed to update.", "error");
    }
  };

  useEffect(() => {
    setFetchingData(true);
    const fetchData = async () => {
      try {
        const [homeHeader, whatsNew] = await Promise.all([
          getHomeHeaderData(),
          getWhatsNew(),
        ]);

        setHomeHeaderData(homeHeader);
        setWhatsNewData(whatsNew);
        setFetchingData(false);
      } catch (error) {
        console.error("Failed to fetch home header data:", error);
        setFetchingData(false);
      }
    };

    fetchData();
  }, [refresh]);
  return (
    <>
      <PageHeader title="CMS" />

      <TabGroup className="tab-group-01">
        <TabList className="tab-list">
          <Tab>Home Header</Tab>
          <Tab>Whats New</Tab>
        </TabList>
        {fetchingdata ? (
          <Loader size="xl" />
        ) : (
          <TabPanels className="tab-panels">
            <TabPanel>
              <div className="secBtnRow">
                <button
                  className={`btn btn-primary ${
                    activeSectionHomeHeader === "homeheadersection1"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setactiveSectionHomeHeader("homeheadersection1")
                  }
                >
                  Section 1
                </button>
                <button
                  className={`btn btn-primary ${
                    activeSectionHomeHeader === "homeheadersection2"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setactiveSectionHomeHeader("homeheadersection2")
                  }
                >
                  Section 2
                </button>
                <button
                  className={`btn btn-primary ${
                    activeSectionHomeHeader === "homeheadersection3"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setactiveSectionHomeHeader("homeheadersection3")
                  }
                >
                  Section 3
                </button>
              </div>
              <div className="secContent">
                <div className="secContent-item active">
                  {renderSectionsHomeHeader()}

                  <div className="btnRow">
                    <button
                      className="btn btn-primary flex items-center gap-2"
                      onClick={saveHomeHeaderChanges}
                      disabled={loading}
                    >
                      {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              {" "}
              <div className="secBtnRow">
                <button
                  className={`btn btn-primary ${
                    activeSectionWhatsNew === "whatsnewsection1" ? "active" : ""
                  }`}
                  onClick={() => setactiveSectionWhatsNew("whatsnewsection1")}
                >
                  Section 1
                </button>
                <button
                  className={`btn btn-primary ${
                    activeSectionWhatsNew === "whatsnewsection2" ? "active" : ""
                  }`}
                  onClick={() => setactiveSectionWhatsNew("whatsnewsection2")}
                >
                  Section 2
                </button>
                <button
                  className={`btn btn-primary ${
                    activeSectionWhatsNew === "whatsnewsection3" ? "active" : ""
                  }`}
                  onClick={() => setactiveSectionWhatsNew("whatsnewsection3")}
                >
                  Section 3
                </button>
              </div>
              <div className="secContent">
                <div className="secContent-item active">
                  {renderSectionsWhatsNext()}
                  <div className="btnRow">
                    <button
                      className="btn btn-primary flex items-center gap-2"
                      onClick={saveWhatsNewChanges}
                      disabled={loading}
                    >
                      {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        )}
      </TabGroup>
    </>
  );
};

export default Crm;
