import React, { createContext, useState } from 'react'
export const MyContext = createContext();
const Context = (props) => {
    const [selectedData, setSelectedData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [removeSelectedKey, setRemoveSelectedKey] = useState(-1);
    return (
        <MyContext.Provider value={{ selectedData, setSelectedData, openModal, setOpenModal, removeSelectedKey, setRemoveSelectedKey }}>
            {props.children}
        </MyContext.Provider>
    )
}
export default Context