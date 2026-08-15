import { useCallback } from "react";
import ImageCropPicker from "react-native-image-crop-picker";
import { usePermissions } from "./usePermissions";

export const useImagePicker = () => {
  const { requestPhotoLibraryPermission, requestCameraPermission } =
    usePermissions();

  const openGallery = useCallback(
    async (options = {}) => {
      try {
        const isGranted = await requestPhotoLibraryPermission();
        if (!isGranted) return null;

        const defaultOptions = {
          mediaType: "photo",
          includeBase64: false,
          includeExif: true,
          cropping: true,
          multiple: false,
        };

        const selectedFiles = await ImageCropPicker.openPicker({
          ...defaultOptions,
          ...options,
        });

        if (!selectedFiles) return null;

        // ImageCropPicker returns an array if multiple: true, else a single object
        const filesArray = Array.isArray(selectedFiles)
          ? selectedFiles
          : [selectedFiles];

        return filesArray.map((file) => {
          const filename =
            file.filename ||
            file.path.split("/").pop() ||
            (file.mime?.startsWith("video/") ? "video.mp4" : "image.jpg");

          return {
            path: file.path,
            mime: file.mime,
            name: filename,
            isImage: !file.mime?.startsWith("video/"),
            size: file.size,
            width: file.width,
            height: file.height,
          };
        });
      } catch (err) {
        if (err.code !== "E_PICKER_CANCELLED") {
          console.log("GALLERY ERROR ===>", err);
        }
        return null;
      }
    },
    [requestPhotoLibraryPermission],
  );

  const openCamera = useCallback(
    async (options = {}) => {
      try {
        const isGranted = await requestCameraPermission();
        if (!isGranted) return null;

        const defaultOptions = {
          mediaType: "photo",
          includeBase64: false,
          cropping: false,
        };

        const file = await ImageCropPicker.openCamera({
          ...defaultOptions,
          ...options,
        });

        if (!file) return null;

        const filename =
          file.filename ||
          file.path.split("/").pop() ||
          (file.mime?.startsWith("video/") ? "video.mp4" : "image.jpg");

        return [
          {
            path: file.path,
            mime: file.mime,
            name: filename,
            isImage: !file.mime?.startsWith("video/"),
            size: file.size,
            width: file.width,
            height: file.height,
          },
        ];
      } catch (err) {
        if (err.code !== "E_PICKER_CANCELLED") {
          console.log("CAMERA ERROR ===>", err);
        }
        return null;
      }
    },
    [requestCameraPermission],
  );

  return { openGallery, openCamera };
};
