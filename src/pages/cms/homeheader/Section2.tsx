import { Field, Input, Label } from "@headlessui/react";

const HomeHeaderSection2 = ({ data, onChange }: any) => {
  return (
    <>
      <div className="row">
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading 1</Label>
            <Input
              name="heading1"
              value={data.sec2_heading1}
              onChange={(e) => onChange("sec2_heading1", e.target.value)}
            />
          </Field>
        </div>
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading 2</Label>
            <Input
              name="Heading 2"
              value={data.sec2_heading2}
              onChange={(e) => onChange("sec2_heading2", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <Field className="fieldDv">
        <Label>Description</Label>
        <textarea
          name="description"
          value={data.sec2_description}
          onChange={(e) => onChange("sec2_description", e.target.value)}
        />
      </Field>
    </>
  );
};

export default HomeHeaderSection2;
