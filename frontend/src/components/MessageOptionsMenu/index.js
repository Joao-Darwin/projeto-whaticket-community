import React, { useState, useContext } from "react";

import MenuItem from "@material-ui/core/MenuItem";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ConfirmationModal from "../ConfirmationModal";
import { Menu } from "@material-ui/core";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import toastError from "../../errors/toastError";
import InformationModal from "../InformationModal";

const MessageOptionsMenu = ({ message, menuOpen, handleClose, anchorEl }) => {
  const { setReplyingMessage } = useContext(ReplyMessageContext);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [showTranscribedText, setShowTranscribedText] = useState(false);
  const [audioMessageTranscribeToText, setAudioMessageTranscribeToText] = useState("");

  const handleDeleteMessage = async () => {
    try {
      await api.delete(`/messages/${message.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const hanldeReplyMessage = () => {
    setReplyingMessage(message);
    handleClose();
  };

  const handleOpenConfirmationModal = (e) => {
    setConfirmationOpen(true);
    handleClose();
  };

  const handleTranscriptionAudioToText = async () => {

    try {

      const { data } = await api.get(`/messages/transcribeAudio/${message.body}`);

      setAudioMessageTranscribeToText(data);
      setShowTranscribedText(true);
      handleClose();

    } catch (err) {
      toastError(err);
    }

  }

  return (
    <>
      <ConfirmationModal
        title={i18n.t("messageOptionsMenu.confirmationModal.title")}
        open={confirmationOpen}
        onClose={setConfirmationOpen}
        onConfirm={handleDeleteMessage}
      >
        {i18n.t("messageOptionsMenu.confirmationModal.message")}
      </ConfirmationModal>
      <InformationModal
        title={i18n.t("messageOptionsMenu.informationModal.title")}
        open={showTranscribedText}
        onClose={setShowTranscribedText}
      >
        {audioMessageTranscribeToText}
      </InformationModal>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={menuOpen}
        onClose={handleClose}
      >
        {message.fromMe && (
          <MenuItem onClick={handleOpenConfirmationModal}>
            {i18n.t("messageOptionsMenu.delete")}
          </MenuItem>
        )}
        <MenuItem onClick={hanldeReplyMessage}>
          {i18n.t("messageOptionsMenu.reply")}
        </MenuItem>
        {(message.mediaType === "audio" && !message.fromMe) && (
          <MenuItem onClick={handleTranscriptionAudioToText}>
            {i18n.t("messageOptionsMenu.transcribe")}
          </MenuItem>)}
      </Menu>
    </>
  );
};

export default MessageOptionsMenu;
