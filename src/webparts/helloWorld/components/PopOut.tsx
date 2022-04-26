import * as React from 'react';
import { EcartType, Mediane, Prix_unitaire_max, Prix_unitaire_min, Prix_unitaire_moyen } from '../utils';

export interface IPopOutProps {
  //marker: any;
  evaluation:any;
}

function PopOut (props:IPopOutProps) {
  let prix_unit:any = Get_all_Prix_unit();
  
  function Get_all_Prix_unit(){
    let prix_unit:any = [];
    props.evaluation.all_ref.forEach(element => {
      console.log("---->", element)
      var p_int = parseInt(element.Prix_x0020_unitaire_x0020_pond_x);
      prix_unit.push(p_int);
    });
    return prix_unit;
  }
  return (
  <>
    <div>
      {console.log("props evaluation", props)}
      <table className="margin-left:25px">
        <tbody>
          <tr>
            <td ><b>Prix Unitaire éstimé</b></td>
            <td >{props.evaluation.prix_estimer.toFixed(2)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Prix Total éstimé</b></td>
            <td >{props.evaluation.prix_total.toFixed(2)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Périmètre d'étude</b></td>
            <td >{props.evaluation.perimetre} m de rayon</td>
          </tr>
          <tr>
            <td ><b>Nature de référence sélectionnée</b></td>
            <td >{props.evaluation.type_de_bien}</td>
          </tr>
          {props.evaluation.nbr_ref_dexa?
          <tr>
            <td ><b>Nombre de pins (Valactif)</b></td>
            <td >{props.evaluation.nbr_ref_dexa} références</td>
          </tr>
          :<></>}
          {props.evaluation.nbr_ref_org?
          <tr>
            <td ><b>Nombre de pins (Org)</b></td>
            <td >{props.evaluation.nbr_ref_org} références</td>
          </tr>
          :<></>}
          <tr>
            <td ><b>Prix unitaire Maximum</b></td>
            <td >{Prix_unitaire_max(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Prix unitaire Minimum</b></td>
            <td >{Prix_unitaire_min(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Prix unitaire moyen</b></td> 
            <td >{Prix_unitaire_moyen(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Médiane</b></td>
            <td >{Mediane(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Etendue</b></td>
            <td >{Prix_unitaire_max(prix_unit) - Prix_unitaire_min(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Ecart type de l'échantillon</b></td>
            <td >{EcartType(prix_unit)} dhs/m2</td>
          </tr>
          <tr>
            <td ><b>Zone DGI</b></td>
            <td >{props.evaluation.dgi_zone.Title}</td>
          </tr>
          <tr>
            <td ><b>Prix unitaire de la DGI</b></td>
            <td >{props.evaluation.dgi_zone.PU} dhs/m2</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
  );
}
export default PopOut;