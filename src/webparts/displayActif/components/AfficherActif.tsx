import pnp from "sp-pnp-js";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import * as React from 'react';
import * as moment from "moment"
import styles from "./DisplayActif.module.scss";
const web =  Web("https://valactifcom.sharepoint.com/sites/SGMB/");
function AfficherActifs (props:any){
    let [info, setInfo] = React.useState(null);
    const actif_title = props.actif_title;
    console.log("actif_title",actif_title);
    async function getInformation(){
        var query = function(element) {
            return element.Title === actif_title;
        };
        const act = await web.lists.getByTitle('Actifs').items.select("Id","Latitude_x002d_Longitude","Title", "Lien").getAll();
        
        const actifs = await web.lists.getByTitle('Actifs').items.select("*", "Ville_x0020_actif/Title").expand("Ville_x0020_actif").getAll();
        const actif = actifs.filter(query);
        
        setInfo(actif[0]);
    }

    React.useEffect(() => {
        getInformation();
    },[actif_title]);
    console.log("Info -> ", info)
    return (
        <>
        <table><tr><td><h1>Informations générales</h1></td></tr></table>
            {info?
            <div className={styles.DivAffichage}>
                <table>
                    <tr>
                    <td><span className={styles.spanInfo} >Dénomination </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Title}</span></td> 
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Typologie du bien </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Typologie_x0020_de_x0020_bien}</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Ville </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Ville_x0020_actif.Title}</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Adresse </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.WorkAddress}</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Titre(s) foncier(s) </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Titre_x0028_s_x0029__x0020_fonci}</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Surface utile pondérée </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Surface_x0020_pond_x00e9_r_x00e9} m2</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Surface titrée </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Surface_x0020_titr_x00e9_s_x0020} m2</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Taux D'occupation </span></td>
                    <td><span>:</span></td> 
                    <td><span>{info.Taux_x0020_d_x0027_occupation_x0} %</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Valorisation dhs/m2 utile </span></td>
                    <td><span>:</span></td> 
                    <td><span>{numStr(parseInt(info.Valorisation_x0020_dhs_x002F_m2_0), "")} dhs/m2</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Valorisation dhs/m2 titré </span></td>
                    <td><span>:</span></td> 
                    <td><span>{numStr(parseInt(info.Valorisation_x0020_dhs_x002F_m2_),"")} dhs/m2</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Date de dernière valorisation </span></td>
                    <td><span>:</span></td> 
                    <td><span>{moment(info.Date_x0020_derni_x00e8_re_x0020_).format("DD-MM-YYYY")}</span></td>
                    </tr>
                    <tr>
                    <td><span className={styles.spanInfo}>Valorisation </span></td>
                    <td><span>:</span></td> 
                    <td><span>{numStr(info.Derni_x00e8_re_x0020_valorisatio, "")} dhs</span></td>
                    </tr>
                </table>
            </div>
            :<></>}
        </>
    );
}
export default AfficherActifs;

function numStr(a, b) {
    a = '' + a;
    b = b || ' ';
    var c = '',
        d = 0;
    while (a.match(/^0[0-9]/)) {
      a = a.substr(1);
    }
    for (var i = a.length-1; i >= 0; i--) {
      c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
      d++;
    }
    return c;
  }