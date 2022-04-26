import MarkerClusterer from '@google/markerclusterer';
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/webs";
import GoogleMapReact from 'google-map-react';
import { Dialog, DialogType, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getLat, getLng, isPointInPolygon, WindowPopUp } from '../utils';
import AddActif from './AddActif';
import { DialogAddRefOrganisme } from './DialogAddRefOrganisme';
import { DialogEvaluation } from './DialogEvaluation';
import Evaluer from './Evaluer';
import Filtrer from './Filtrer';
import styles from './HelloWorld.module.scss';
import PopOutFilter from './PopOutFilter';
import { sp } from "@pnp/sp/presets/all";
import { DialogHorsZone } from './DialogHorsZone';

export interface IMapContainerProps {
  GoogleKey:string;
}

export default function MapContainer(props:IMapContainerProps){
  let [popupMarkerActif, setPopupMarkerActif]= React.useState({});
  let [updatedMarker, setUpdatedMarker]= React.useState(false);
  let [rightClickMarker, setRightClickMarker]= React.useState(false);
  let [rightClickMap, setRightClickMap]= React.useState(false);
  let [copySuccess, setCopySuccess]= React.useState('');
  let [lat, setLat]= React.useState(null);
  let [lng, setLng]= React.useState(null);
  let [maps, setMaps]= React.useState(null);
  let [map, setMap]= React.useState(null);
  let [dexa_markers, setDexa_markers]= React.useState(null);
  let [dossiers_markers, setDossiers_markers]= React.useState(null);
  let [org_markers, setOrg_markers]= React.useState(null);
  let [actifs, setActifs_markers]= React.useState(null);
  let [result, SetResult]= React.useState(null);
  let [popupInfo, setPopupInfo]= React.useState(null);
  let [DGI, setDGI] = React.useState(null);
  let [popOut, setPopOut] = React.useState(false);
  let [information, setInformation] = React.useState(null);
  let [GoogleKey, setGoogleKey] = React.useState(props.GoogleKey);//("AIzaSyCxaqEkaXKo3JanMazPfrh9ncLnLRn2q4Q");
  let markers_google:any= null;
  let markerCluster:any = null;
  let input = useRef(null);
  let [typeDeBien, setTypeDeBien] = React.useState("");
  let [testDgi, setTestDgi] = React.useState(false);
  

  const FiltrageDialogContentProps = {
    type: DialogType.largeHeader,
    title: "Analyse de la zone",
    subText: ''
  };
  const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650 } },
  };
  const MarkerClustering = ({markers, map, maps}) => {
 
    setTimeout(()=> displayMarkerCluster(markers, map, maps), 3000);
  
  
    //let inputSearch = <div key={"inputSearch"}><input ref={input} placeholder={placeholder} className={styles.googleMapSearchBox} type="text" /></div>;
    return <></>;
  };
  const defaultProps = {
      center: {
        lat: 33.53681110956971,
        lng: -7.529033709989725
      },
      zoom: 11,
      disableDefaultUI: false,
  };
  const options_Cluster = {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
       // gridSize: 20,
        //minimumClusterSize: 2
  };
  const handleApiLoaded = (map, maps) => {
      // use map and maps objects
      setMaps(maps);
      setMap(map);

      if (map) {
        markerCluster=new MarkerClusterer(map, [], {
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
    }
    maps.event.addListener(map, "rightclick", async function(event) {
      maps.event.trigger(map, 'resize'); 
      setTimeout(()=> {
          setCopySuccess('');
          setPopupInfo(null);
          setRightClickMarker(rightClickMarker => 
            {
            if(rightClickMarker){
              event.preventDefault;
              setRightClickMarker(false);
            }
            else{
              setRightClickMap(true);
              setPopupInfo(null);
              var _lat = parseFloat(event.latLng.lat());
              var _lng = parseFloat(event.latLng.lng());
              setLat(_lat);
              setLng(_lng); //alert("on right click from maps");
              //var dgi = get_dgi_zone(lat,lng);lat+","+lng setCopySuccess('Copied!');
              navigator.clipboard.writeText(event.latLng.lat()+","+event.latLng.lng());
              //setCopySuccess('Copied!');
            }
            getDGI(_lat,_lng);
            return rightClickMarker;
          });
        }, 200);
    });
  };
  const Marker = ({ marker, lat, lng, text}) => <div className={ styles.marker }
  onClick={()=> {onMarkerClick(text, marker, "Valactif");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>;
  const Marker_organisme = ({ marker, lat, lng, text}) => <div className={ styles.markerOrganisme }
  onClick={()=> {onMarkerClick(text, marker, "Actifs");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>; 
  const Marker_actif = ({ marker, lat, lng, text}) => <div className={ styles.markerActifs }
  onClick={()=> {onMarkerClick(text, marker, "Dossiers");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>; 
  const Popup = ({ lat, lng}) =>
    <div className={styles.popupMarker}>
      <div className={styles.CloseDiv} onClick={()=> setPopupInfo(null)}>X</div>
      <div className={styles.arrowPopUp}></div>
      <span className={styles.spanInfo}>Référence: </span>{popupInfo.marker.Title}
      <br/>
      <div><span className={styles.spanInfo}>Type de Référence:</span><span>{typeDeBien}</span></div>
      <div><span className={styles.spanInfo}>Surface:</span><span>{popupInfo.marker.Surface_x0020_pond_x00e9_r_x00e9} m²</span></div>
      {/*<div><span className={styles.spanInfo}>Prix Unitaire:</span><span>{parseInt(popupInfo.marker.Prix_unitaire_de_la_reference).toFixed(0)} DH/m²</span></div>*/}
      <br/>      
      <a className={styles.rightFloat} href="#" onClick={(event)=> {
        event.preventDefault();
        WindowPopUp("get info", "https://valactifcom.sharepoint.com/sites/SGMB/Lists/l_ref_Dexa/DispForm.aspx?ID="+popupInfo.marker.Id, "Valactif");}}>Voir plus...</a>
    </div>;
  const PopupOrganisme = ({ lat, lng}) =>
    <div className={styles.popupMarker}>
      <div className={styles.CloseDiv} onClick={()=> setPopupInfo(null)}>X</div>
      <div className={styles.arrowPopUp}></div>
      <span className={styles.spanInfo}>Référence: </span>{popupInfo.marker.Title}
      <br/>
      <div><span className={styles.spanInfo}>Type de Référence:</span><span>{typeDeBien}</span></div>
      <div><span className={styles.spanInfo}>Surface:</span><span>{popupInfo.marker.Surface_pondere} m²</span></div>
      {/*<div><span className={styles.spanInfo}>Prix Unitaire:</span><span>{parseInt(popupInfo.marker.Prix_unitaire_de_la_reference).toFixed(0)} DH/m²</span></div>*/}
      <a className={styles.rightFloat} href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("get info", "https://valactifcom.sharepoint.com/sites/SGMB/Lists/l_ref_Org/DispForm.aspx?ID="+popupInfo.marker.Id, "l_ref_Org");}}>Voir Plus</a>
    </div>;
  const PopupActif = ({ lat, lng}) =>
    <div className={styles.popupMarker}>
      <div className={styles.CloseDiv} onClick={()=> setPopupInfo(null)}>X</div>
      <div className={styles.arrowPopUp}></div>
      <span className={styles.spanInfo}>Référence: </span>{popupInfo.marker.Title}
      <br/>
      <div><span className={styles.spanInfo}>Type de Référence:</span><span>{typeDeBien}</span></div>
      <div><span className={styles.spanInfo}>Surface:</span><span>{popupInfo.marker.Surface} m²</span></div>
      {/*<div><span className={styles.spanInfo}>Prix Unitaire:</span><span>{parseInt(popupInfo.marker.Prix_unitaire_de_la_reference).toFixed(0)} DH/m²</span></div>*/}
      <br/>      
      <a className={styles.rightFloat} href="#" onClick={(event)=> {
        event.preventDefault(); WindowPopUp("get info", "https://valactifcom.sharepoint.com/sites/SGMB/Lists/Dossiers/DispForm.aspx?ID="+popupInfo.marker.Id, "Dossiers");}}>Voir plus...</a>
    </div>;
  // const PopupRight = ({ lat, lng , modaleTitle, url}) => 
  //   <div className={styles.popupRight}>
  //     <div className={styles.CloseDiv} onClick={()=> setPopupInfo(null)}>X</div>
  //     <br/>
  //     <div>
  //       <CopyToClipboard text={lat+","+lng} onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
  //         <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
  //       </CopyToClipboard>
  //       <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
  //     </div>
  //     <Filtrer dgi={DGI} buttonTitle="Analyser la zone" latlng={lat+","+lng} handleFilter={(items_dexa,items_org,distance, type_de_bien) => displayMarker(items_dexa,items_org,distance,type_de_bien)} ></Filtrer>
  //     <Evaluer dgi={DGI} buttonTitle="Evaluer le bien" latlng={lat+","+lng} handleEvaluer={(result) => {if(result!=null) {moreInfo(result);}}} ></Evaluer>
  //     <DialogEvaluation/>
  //     <br/>
  //     <DialogLargeHeaderExample/>
  //     <br/>
  //     <div className={styles.arrow}></div>
  //   </div>;
  const PopupRightOrganisme = ({ lat, lng , modaleTitle, url}) => {
    return (
      <div className={styles.popupRight}>
        <div className={styles.CloseDiv} onClick={()=> setRightClickMap(false)}>X</div>
        <br/>
        <div>
          <CopyToClipboard text={lat+","+lng} onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
            <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
          </CopyToClipboard>
          <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
        </div>
        <Filtrer dgi={DGI}  buttonTitle="Analyser la zone" latlng={lat+","+lng} handleFilter={ async (items_dexa,items_org,dossiers,distance,type_de_bien) => await displayMarker(items_dexa,items_org,dossiers,distance,type_de_bien)} ></Filtrer>
        <Evaluer dgi={DGI} buttonTitle="Evaluer le bien" latlng={lat+","+lng} handleEvaluer={(result) => {if(result!=null) {moreInfo(result);}}} ></Evaluer>
        <DialogEvaluation/>
        <br/>
        <DialogAddRefOrganisme/>
        <br/>
        <AddActif buttonTitle='Nouveau dossier'/>
        <br/>


        <div className={styles.arrow}></div>
      </div>
    );
  };
  // const PopupRightValorisation = ({ lat, lng , modaleTitle, url}) => 
  //     <div className={styles.popupMarker}>
  //         <div className={styles.arrow}></div>
  //         <br/>
  //         <div>
  //           <CopyToClipboard text={lat+","+lng}
  //               onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
  //               <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
  //           </CopyToClipboard>
  //           <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
  //         </div>

  //         <Filtrer dgi={DGI} buttonTitle="Analyser la zone" latlng={lat+","+lng} handleFilter={(items_dexa,items_org,distance,type_de_bien) => displayMarker(items_dexa,items_org,distance,type_de_bien)} ></Filtrer>
  //         {<Evaluer dgi={DGI} buttonTitle="Evaluer le bien" latlng={lat+","+lng} handleEvaluer={(result) => moreInfo(result)} ></Evaluer>}
  //         <DialogEvaluation/>
  //         <br/>
  //         <DialogLargeHeaderExample/>
  //         <br/>
  //     </div>;
  const SearchBox = ({ map, maps, onPlacesChanged, placeholder }) => {
    input = useRef(null);
    const searchBox = useRef(null);
    useEffect(() => {
      if (!searchBox.current && maps && map) {
        searchBox.current = new maps.places.SearchBox(input.current);
        maps.event.addListener(searchBox.current, 'places_changed', function() {
          var places = searchBox.current.getPlaces();
          places.forEach(place => {
            var myLatlng = new maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
            map.setCenter(myLatlng);
            var marker = new maps.Marker({
              position: myLatlng,
              map:map
            });
          });
        });
      }
      return () => {
        if (maps) {
          searchBox.current = null;
          maps.event.clearInstanceListeners(searchBox);
        }
      };
    });
    let inputSearch = <div key={"inputSearch"}><input ref={input} placeholder={placeholder} className={styles.googleMapSearchBox} type="text" /></div>;
    return inputSearch;
  };
  async function getDGI(lat,lng){
    let ddgi = await sp.web.lists.getByTitle("l_ref_DGI").items.getAll();
    // console.log("DDGI", ddgi)
    var query = function(element) {
        return isPointInPolygon(lat, lng, element.Polygone);
    };
    const isDGI = ddgi.filter(query);
    if(isDGI.length != 0){
      setTestDgi(true)
      setDGI(isDGI);
    }
    else{
      setDGI(null);
      setTestDgi(false);
    }
  }
  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function displayMarkerCluster(markers, map, maps){
  await sleep(1);
  if(markerCluster!=null){
    markerCluster.clearMarkers();
  }
  let markers_google = markers.map((marker, i) => {
    var myLatlng = new maps.LatLng(getLat(marker.Latitude_x002d_Longitude),getLng(marker.Latitude_x002d_Longitude));
      var infowindow = new maps.InfoWindow({
        position: myLatlng,
        content:
        "<div style='color:black'>"+
       " <a target='_blank' href='https://valactifcom.sharepoint.com/sites/SGMB/Lists/l_ref_Dexa/DispForm.aspx?ID="+marker.Id+"'>Ajouter une référence2</a>"
        +"</div>"
      });
      var m =  new maps.Marker({
        position: myLatlng,
      });
      m.addListener('click', function() {
        infowindow.open(map, m);
    });
    return m;
});

let markers_google_view = markers_google.filter(c=> map.getBounds().contains(c.getPosition()));
//markerCluster = new MarkerClusterer(map, markers_google_view, options_Cluster);
markerCluster.addMarkers(markers_google_view);
  }
  async function onMarkerClick(text, marker,from_list) {
    setPopupInfo(null);

    //setPopupMarkerActif(_popupMarkerActif);
    setRightClickMap(false);
    var pin = {
      marker: marker,
      from_list: from_list
    };
    setPopupInfo(pin);
  }
  async function onMarkerRightClick(marker) {
   // maps.event.addListener(map, "rightclick", async function(event) {event.preventDefault();});
   setPopupInfo(null);
   setRightClickMarker(rightClickMarker=> {return true;});
    return rightClickMarker;
  }
  function moreInfo(evaluation){
    SetResult(evaluation);
  }
  async function displayMarker (item_dexa:any, item_org:any, dossiers:any, distance:any, type_de_bien) {
    setPopupInfo(null);
    setTypeDeBien(type_de_bien);
      await setDexa_markers(item_dexa);
      await setOrg_markers(item_org);
      await setDossiers_markers(dossiers);
      setUpdatedMarker(true);
      var _prix_moyen = 0;
      var result = {
        dgi_zone:DGI,
        ref_dexa: item_dexa,
        ref_org: item_org,
        distance: distance,
        type_de_bien: type_de_bien,
        dossiers:dossiers
      };
      // console.log("DGI displayMarker", DGI)
      setInformation(result);
      setPopOut(true);
  }
  async function displayActifs (item_actifs:any) {
    setPopupInfo(null);
    //await sleep(2);
      await setActifs_markers(item_actifs);
      //setUpdatedMarker(true);
  }
  return ( 
    <div className={styles.googleMapReact}>
      {popOut?
        <>
          {testDgi?
            <Dialog hidden={!popOut} onDismiss={()=> setPopOut(false)} dialogContentProps={FiltrageDialogContentProps} modalProps={modelProps} styles={{main: {selectors: {['@media (min-width: 480px)']: { width: 550, height: 555, minWidth: 450, maxWidth: '1000px'}}}}}>
              <PopOutFilter Information={information}/>
            </Dialog>
            :
            <Dialog hidden={!popOut} onDismiss={()=> setPopOut(false)} dialogContentProps={FiltrageDialogContentProps} modalProps={modelProps} styles={{main: {selectors: {['@media (min-width: 480px)']: { width: 550, height: 150, minWidth: 100, maxWidth: '1000px'}}}}}>
              <DialogHorsZone/>
            </Dialog>
          }
        </>
        :<></>
      }
      <Stack horizontal>
        <div> 
          <SearchBox onPlacesChanged={null} map={map} maps={maps} placeholder={"search..."}/>
        </div>
        {/* <div className={styles.rightFloatBien}>
          <Stack horizontal horizontalAlign="end"> 
            <AddActif buttonTitle="Nouveau dossier"/>
          </Stack>
        </div> */}
      </Stack>
      <GoogleMapReact bootstrapURLKeys={{ key: GoogleKey, libraries:['places'] }} defaultCenter={defaultProps.center} defaultZoom={defaultProps.zoom} yesIWantToUseGoogleMapApiInternals onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)} options={map => ({streetViewControl: true,mapTypeControl: true, mapTypeControlOptions: {style: map.MapTypeControlStyle.DEFAULT,position: map.ControlPosition.TOP_RIGHT,mapTypeIds: [map.MapTypeId.ROADMAP,map.MapTypeId.SATELLITE,map.MapTypeId.HYBRID]},})}>
        {console.log("popupInfo", popupInfo)}
        {actifs?
          actifs.map(marker=> <Marker_actif lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>):<></>
        }
        {updatedMarker&&org_markers?
          org_markers.map(marker=> <Marker_organisme lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>):<></>
        }
        {updatedMarker&&dexa_markers?
          dexa_markers.map(marker=> <Marker lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>):<></>
        }
        {updatedMarker&&dossiers_markers?
          dossiers_markers.map(marker=> <Marker_actif lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>):<></>
        }
        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="Valactif"?
          <Popup lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)} lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)}/>:<></>
        }
        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="Actifs"?
          <PopupOrganisme lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)} lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)}/>:<></>
        }
        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="Dossiers"?
          <PopupActif lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)} lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)}/>:<></>
        }
        {rightClickMap?
          <PopupRightOrganisme lat={lat} lng={lng} url={"https://agroupma.sharepoint.com/sites/devsp/Lists/PinRef/newform.aspx"} modaleTitle={"Ajouter Réference"}/>:<></>
        }
      </GoogleMapReact>
    </div>
  );
}
