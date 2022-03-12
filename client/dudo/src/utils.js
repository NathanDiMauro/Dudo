// Making sure player can only enter numbers
const isNumberKey = (e) => {
    var charCode = (e.which) ? e.which : e.keyCode
    if (charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))) {
        e.preventDefault();
        return false;
    }
    return true;
}


export { isNumberKey };