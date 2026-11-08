import { toFieldName } from "../utils";

export function setServerErrors(error, form)
{
  const data = error.response?.data;
  if (data?.errors) {
    for (const [key, messages] of Object.entries(data.errors)) {
      form.setError(toFieldName(key), {
        type: "server",
        message: messages.join(",,,"),
      });
    }
  } else {
    form.setError("root.server", {
      type: "server",
      message: data?.detail ?? data?.title ?? "an error happened, please try again later",
    });
  }
}
