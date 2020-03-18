import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";
import {
  useUploadFileToCollectionMutation,
  useUpdateThingMutation
} from "codegen";
import { uploadFileToS3 } from "utils/upload-s3";
import UploadOverlay from "components/upload-overlay";

const DropZone = ({
  children,
  collectionId,
  callback
}: {
  children?: React.ReactNode;
  collectionId: string;
  callback: (id: string) => void;
}) => {
  const [getPresignedPost] = useUploadFileToCollectionMutation();
  const [updateThing] = useUpdateThingMutation();
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    getPresignedPost({
      variables: {
        collectionId
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
        acceptedFiles[0]
      ).then(({ data }) => {
        callback(id);
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const open = isDragActive;
  console.log({ isDragActive });

  return (
    <div {...getRootProps()}>
      {open && <UploadOverlay />}
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default DropZone;
