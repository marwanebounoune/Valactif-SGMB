import * as React from 'react';
import { EcartType, Mediane, Prix_unitaire_max, Prix_unitaire_min, Prix_unitaire_moyen } from '../utils';
import { DialogHorsZone } from './DialogHorsZone';
import { IPopOutFilter } from './IPopOutFilter';

function PopOutFilter (props:IPopOutFilter) {
  let prix_unit:any = Get_all_Prix_unit();
  React.useEffect(() => {
  },[]);
  function Get_all_Prix_unit(){
    let prix_unit:any = [];
    props.Information.ref_dexa.forEach(element => {
      console.log("DEXA", element)
      var p_int = parseInt(element.Prix_x0020_unitaire_x0020_pond_x);
      prix_unit.push(p_int);
    });
    props.Information.ref_org.forEach(element => {
      console.log("ORG", element)
      var p_int = parseInt(element.Prix_x0020_unitaire_x0020_pond_x);
      prix_unit.push(p_int);
    });
    props.Information.dossiers.forEach(element => {
      console.log("ORG", element)
      var price:any = element.Evaluation/element.Surface
      var p_int = parseInt(price);
      prix_unit.push(p_int);
    });
    return prix_unit;
  }
  function get_title_dgi(){
    if(props.Information.dgi_zone.length===0){
      return props.Information.dgi_zone[0].Title;}
    return "";
  }
  function get_prix_dgi(){
    if(props.Information.dgi_zone.length===0){
      return props.Information.dgi_zone[0].Prix_unitaire;}
    return 0;
  }
  return (
    <>
    {console.log("Props filter", props)}
        <div>
          <table className="margin-left:25px">
            <tbody>
              <tr>
                <td ><b>Périmètre d'étude</b></td>
                <td >{props.Information.distance} km de rayon</td>
              </tr>
              <tr>
                <td ><b>Nature de référence sélectionnée</b></td>
                <td >{props.Information.type_de_bien}</td>
              </tr>
              {props.Information.ref_dexa.length?
              <tr>
                <td ><b>Nombre des pins (Valactif)</b></td>
                <td >{props.Information.ref_dexa.length} références</td>
              </tr> 
              :<></>}
              {props.Information.ref_org.length?
              <tr>
                <td ><b>Nombre des pins (Org)</b></td>
                <td >{props.Information.ref_org.length} références</td>
              </tr>
              :<></>}
              {props.Information.dossiers.length?
              <tr>
                <td ><b>Nombre des dossiers</b></td>
                <td >{props.Information.dossiers.length} références</td>
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
              {/* <tr>
                <td ><b>Ecart type de l'échantillon</b></td>
                <td >{EcartType(prix_unit)} dhs/m2</td>
              </tr> */}
              {props.Information.dgi_zone[0]?<tr>
                <td ><b>Zone DGI</b></td>
                <td >{props.Information.dgi_zone[0].Title}</td>
              </tr>:<></>}
              {props.Information.dgi_zone[0]?<tr>
                <td ><b>Prix unitaire de la DGI</b></td>
                <td >{props.Information.dgi_zone[0].PU} dhs/m2</td>
              </tr>:<></>}
            </tbody>
          </table>
        </div>
    </>
  );
};
export default PopOutFilter;