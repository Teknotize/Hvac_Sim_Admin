import { Field, Input, Label } from "@headlessui/react";

const HomeHeaderSection3 = ({
  data,
  onChange,
}: {
  data: any;
  onChange: any;
}) => {
  return (
    <>
      <div className="row">
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading 1</Label>
            <Input
              name="heading1"
              value={data.sec3_heading1}
              onChange={(e) => onChange("sec3_heading1", e.target.value)}
            />
          </Field>
        </div>
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading 2</Label>
            <Input
              name="heading2"
              value={data.sec3_heading2}
              onChange={(e) => onChange("sec3_heading2", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <Field className="fieldDv">
        <Label>Description</Label>
        <textarea
          name="description"
          value={data.sec3_description}
          onChange={(e) => onChange("sec3_description", e.target.value)}
        />
      </Field>
    </>
  );
};

export default HomeHeaderSection3;
