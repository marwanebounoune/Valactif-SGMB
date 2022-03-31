import { Web } from "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import * as React from 'react';
import * as moment from "moment"
import styles from "./DescriptifActif.module.scss";
import { sp } from "@pnp/sp/presets/all";

const web =  Web("https://valactifcom.sharepoint.com/sites/SGMB/");
function AfficherActifs (props:any){
    let [info, setInfo] = React.useState(null);
    const actif_title = props.actif_title;
    console.log("actif_title",actif_title);
    async function getInformation(){
        var query = function(element) {
            return element.Ref_actif.Title === actif_title;
        };
        
        const actifs = await sp.web.lists.getByTitle('Descriptifs dossiers').items.select("*", " Ref_actif/Title").expand("Ref_actif").getAll();
        const actif = actifs.filter(query);
        console.log("actifs ->", actif)
        
        setInfo(actif[0]);
    }

    React.useEffect(() => {
        getInformation();
    },[actif_title]);
    console.log("Info test -> ", info)
    return (
        <>
        <h1>Description du dossier: {actif_title}</h1>
            {info?
            <div className={styles.DivAffichage}>
                <div className={styles.leftbox}>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}>Facteurs liés à l'immeuble</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className={styles.spanInfo} >Age de l'immeuble </span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Age_IMM}</span></td> 
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Nombre de niveau</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nbr_niv}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Niveau </span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Niv}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Nombre d'appartement par étages </span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nbr_appt_etage}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Ascenceur</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Ascenceur}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Stationnement</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Stationnement}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Exploitation en étages </span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Exploitation_etg}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Exploitation en RDC </span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Exploitation_rdc}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Sécurité</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Acc_x00e8_s_x0020_interphone}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Sécurité</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.R_x00e9_sidence_x0020_s_x00e9_cu}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Accès à mobilité réduite</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Acc_x00e8_s_x0020_mobilit_x00e9_}</span></td>
                            </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th colSpan={2}>Facteurs liés à l'appartement</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><span className={styles.spanInfo}>Nombre de cuisine</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nombre_x0020_de_x0020_cuisine}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Nombre SDB</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nombre_x0020_SDB}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Npmbre salon</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nombre_x0020_salon}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Nombre chambres</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Nombre_x0020_chambres}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Donne sur</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Donne_x0020_sur}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Orientation</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Orientation}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.rightbox}>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}>Standing</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className={styles.spanInfo}>Chambre (Sol)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Chambre_x0020__x0028_Sol_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Chambre (Mur)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Chambre_x0020__x0028_Mur_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Chambre (Plafond)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Chambre_x0020__x0028_Plafond_x00}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Cuisine (Sol)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Cuisine_x0020__x0028_Sol_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Cuisine (Mur)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Cuisine_x0020__x0028_Mur_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Cuisine (Plafond)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Cuisine_x0020__x0028_Plafond_x00}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>WC (Sol)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.WC_x0020__x0028_Sol_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>WC (Mur)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.WC_x0020__x0028_Mur_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>WC (Plafond)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.WC_x0020__x0028_Plafond_x0029_}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Hall - Salon (Sol)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Hall_x0020__x002d__x0020_Salon_x1}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Hall - Salon (Mur)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Hall_x0020__x002d__x0020_Salon_x}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Hall - Salon (Plafond)</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Hall_x0020__x002d__x0020_Salon_x0}</span></td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th colSpan={2}>Equipements</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className={styles.spanInfo}>Climatiseur</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Climatiseurs}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>SDB</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.SDB}</span></td>
                            </tr>
                            <tr>
                                <td><span className={styles.spanInfo}>Cuisine équipée</span></td>
                                <td><span>:</span></td> 
                                <td><span>{info.Cuisine_x0020__x00e9_quip_x00e9_}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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