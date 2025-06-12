import { Field, Input, Label } from "@headlessui/react";


const HomeHeaderSection1 = ({
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
              value={data.sec1_heading1}
              onChange={(e) => onChange("sec1_heading1", e.target.value)}
            />
          </Field>
        </div>
        <div className="col">
          <Field className="fieldDv">
            <Label>Heading 2</Label>
            <Input
              name="heading2"
              value={data.sec1_heading2}
              onChange={(e) => onChange("sec1_heading2", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <Field className="fieldDv">
        <Label>Description</Label>
        <textarea
          name="description"
          value={data.sec1_description}
          onChange={(e) => onChange("sec1_description", e.target.value)}
        />
      </Field>
    </>
  );
};

export default HomeHeaderSection1;
