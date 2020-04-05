import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateThingMutation } from "codegen";
import { uploadFileToS3 } from "utils/upload-s3";

const DropZone = ({
  children,
  collectionId
}: {
  children: React.ReactNode;
  collectionId: string;
}) => {
  const [mutate] = useCreateThingMutation();
  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      mutate({
        variables: {
          collectionId,
          name: file.name
        }
      }).then(({ data }) => {
        if (
          !data ||
          !data.me ||
          !data.me.collection ||
          !data.me.collection.createThing
        )
          return;
        const {
          url,
          fields
        } = data.me.collection.createThing.createPresignedPost;
        uploadFileToS3(
          {
            url,
            fields: {
              "Content-Type": file.type,
              success_action_status: "201",
              ...fields
            }
          },
          acceptedFiles[0]
        );
      });
    },
    [collectionId, mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ height: "100%", width: "100%" }}>
      <input {...getInputProps()} />
      {isDragActive && <p>Drop the files here ...</p>}
      {children}
    </div>
  );
};

export default DropZone;
