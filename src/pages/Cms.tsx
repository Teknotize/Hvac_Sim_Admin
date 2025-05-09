import { TabList, TabPanels, Tab, TabPanel, TabGroup, Field, Label, Input } from "@headlessui/react";
import PageHeader from "../components/layout/PageHeader";

const Crm = () => {
    return (
        <>
            <PageHeader title="CMS" />

            <TabGroup className="tab-group-01">
                <TabList className="tab-list">
                    <Tab>Home Header</Tab>
                    <Tab>Whats Next</Tab>
                </TabList>
                <TabPanels className="tab-panels">
                    <TabPanel>
                        <div className="secBtnRow">
                            <button className="btn btn-primary active">Section 1</button>
                            <button className="btn btn-primary">Section 2</button>
                            <button className="btn btn-primary">Section 3</button>
                        </div>
                        <div className="secContent">
                            <div className="secContent-item active">
                                <div className="row">
                                    <div className="col">
                                        <Field className="fieldDv">
                                            <Label>Name</Label>
                                            <Input name="full_name" />
                                        </Field>
                                    </div>
                                    <div className="col">
                                        <Field className="fieldDv">
                                            <Label>File</Label>
                                            <Input type="file" name="full_name" />
                                        </Field>
                                    </div>
                                </div>


                                <Field className="fieldDv">
                                    <Label>Description</Label>
                                    <textarea name="full_name" />
                                </Field>

                                <div className="btnRow">
                                    <button className="btn btn-primary">Save</button>
                                </div>

                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>Content 2</TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}

export default Crm;