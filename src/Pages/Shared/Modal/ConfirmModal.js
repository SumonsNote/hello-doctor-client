import React from 'react';

const ConfirmModal = ({ title, msg, closeModal, modalData, handleDeleteDoctor, successButtonName }) => {
    return (
        <div>
            <input type="checkbox" id="confirm-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="confirm-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="py-4">{msg}</p>
                    <div className='modal-action'>
                        <label
                            onClick={() => handleDeleteDoctor(modalData)}
                            htmlFor="confirm-modal"
                            className='btn btn-error'>{successButtonName}</label>
                        <button onClick={closeModal} className='btn btn-outline'>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;