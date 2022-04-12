import pnp from "sp-pnp-js";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import * as React from 'react';
import * as moment from "moment"
import styles from "./DisplayActifSgmb.module.scss";
import { sp } from "@pnp/sp/presets/all";

const web =  Web("https://valactifcom.sharepoint.com/sites/SGMB/");
function AfficherActifs (props:any){
    let [info, setInfo] = React.useState(null);
    const actif_title = props.actif_title;
    console.log("actif_title",actif_title);
    async function getInformation(){
        var query = function(element) {
            return element.Title === actif_title;
        };
        const act = await sp.web.lists.getByTitle('Dossiers').items.getAll();
        console.log("ACT", act)
        const actifs = await sp.web.lists.getByTitle('Dossiers').items.select("*", "Ville_x0020_actif/Title", "Client/Title").expand("Ville_x0020_actif", "Client").getAll();
        console.log("actifs",actifs)
        const actif = actifs.filter(query);
        
        setInfo(actif[0]);
    }

    React.useEffect(() => {
        getInformation();
    },[actif_title]);
    console.log("Info -> ", info)
    return (
        <>
        <h1>Informations générales</h1>
            {info?
            <div className={styles.DivAffichage}>
                <table>
                    <tr>
                        <td><span className={styles.spanInfo}>Dénomination</span></td>
                        <td><span>{info.Title}</span></td> 
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Client</span></td>
                        <td><span>{info.Client.Title}</span></td> 
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Ville</span></td>
                        <td><span>{info.Ville_x0020_actif.Title}</span></td>
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Adresse</span></td>
                        <td><span>{info.WorkAddress}</span></td>
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Typologie du bien</span></td>
                        <td><span>{info.Typologie_x0020_de_x0020_bien}</span></td>
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Titre(s) foncier(s)</span></td>
                        <td><span>{info.Titre_x0028_s_x0029__x0020_fonci}</span></td>
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Surface titrée</span></td>
                        <td><span>{info.Surface} m2</span></td>
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Crédit demandé</span></td>
                        <td><span>{numStr(info.Cr_x00e9_dit_x0020_demand_x00e9_, "")} Dhs</span></td> 
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Evaluation</span></td>
                        {console.log("info.Evaluation", info.Evaluation)}
                        {info.Evaluation?
                            <td><span>{numStr(info.Evaluation, "")} Dhs</span></td>
                        :
                            <td><span>En cours d'évaluation</span></td>
                        }
                    </tr>
                    <tr>
                        <td><span className={styles.spanInfo}>Statut</span></td>
                        <td><span>{info.Statut}</span></td> 
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