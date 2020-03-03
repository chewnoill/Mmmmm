import axios from "axios";

interface PresignedPostData {
  url: string;
  fields: { [key: string]: string };
}

export const uploadFileToS3 = (
  { url, fields }: PresignedPostData,
  file: Blob
) => {
  const formData = new FormData();
  Object.keys(fields).forEach(key => {
    formData.append(key, fields[key]);
  });
  // Actual file has to be appended last.
  formData.append("file", file);
  return axios.post(url, formData);
};
