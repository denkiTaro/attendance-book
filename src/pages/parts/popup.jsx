import { Dialog } from "@mui/material"


/**
 * 
 * @param { { open: boolean, element: HTMLElement, closeFunc: function } } props 
 * @returns 
 */
function Popup(props) {
    return (
        <Dialog
        open={!!(props.open)}
        onClose={() => { props.closeFunc() }}
        >
            {
            props.element
            }
        </Dialog>
    )
}


export default Popup;
