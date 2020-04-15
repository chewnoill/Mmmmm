import { useCallback } from "react";
import { useUploadFileToCollectionMutation } from "codegen";
import { uploadFileToS3 } from "utils/upload-s3";
import { useSelectedCollectionId } from "context/collection-flow";

const useOnDrop = ({
  callback
}: {
  callback: (props: { id: string; fileName: string; mimeType: string }) => void;
}) => {
  const collectionId = useSelectedCollectionId();
  const [getPresignedPost] = useUploadFileToCollectionMutation();
  const onDrop = useCallback(
    (d, e) => {
      const files = e.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const file = files[0];
      const fileName = file.name;
      const mimeType = file.type;

      getPresignedPost({
        variables: {
          collectionId,
          mimeType
        }
      }).then(({ data }) => {
        if (!data?.me?.collection?.uploadFile) return;
        const {
          presignedPost: { url, fields },
          id
        } = data.me.collection.uploadFile;
        uploadFileToS3(
          {
            url,
            fields: {
              "Content-Type": file.type,
              success_action_status: "201",
              ...fields
            }
          },
          file
        ).then(({ data }) => {
          callback({ id, fileName, mimeType });
        });
      });
    },
    [collectionId, callback, getPresignedPost]
  );
  return onDrop;
};

export default useOnDrop;
