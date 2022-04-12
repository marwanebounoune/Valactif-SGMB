export async function WindowPopUp(modalTitle:string, url:string){
    var left = (screen.width/2)-(840/2);
    var top = (screen.height/2)-(600/2);
    var url_page = url;
    window.open(url_page, modalTitle, "width=840,height=600,menubar=no,toolbar=no,directories=no,titlebar=no,resizable=no,scrollbars=no,status=no,location=no,top="+top+", left="+left);
}