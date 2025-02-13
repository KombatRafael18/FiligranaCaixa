import React from "react";
import Input from "../Input";
import Button from "../Button";

function CustomModal({
  isOpen,
  title,
  message,
  inputValue,
  setInputValue,
  resultMessage,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg w-[500px]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="cursor-pointer text-3xl" onClick={onClose}>
            &times;
          </span>
        </div>

        <p className="mt-2 mb-4">{message}</p>

        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite aqui..."
          className="w-full"
        />

        {resultMessage && <p className="mt-2 text-gray-700">{resultMessage}</p>}

        <div className="mt-4 flex justify-end gap-4">
          <Button onClick={onClose} children="Cancelar" />
          <Button onClick={onConfirm} children="Confirmar" />
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
