import { Form } from "react-router";
import type { FormData } from "~/types/form";

export default function FormField({formData, value }: { formData: Array<FormData>, value: string }) {
    return <Form method="post" className="flex flex-col justify-center gap-5">
    {formData.map((data, index) => (
      <input
        key={index}
        type={data.type}
        name={data.name}
        defaultValue={data.value}
        placeholder={data.placeholder}
        required
        className="block w-1/2 lg:w-1/3 m-auto h-10 border-white border-2 rounded-md p-3"
      />
    ))}
    <button
      type="submit"
      className="block w-1/2 lg:w-1/3 m-auto h-10 border-sky-950 bg-gray-900 border-2 rounded-md"
      value={value}
    >
      Submit
    </button>
  </Form>
}