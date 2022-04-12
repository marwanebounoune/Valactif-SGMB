import MarkerClusterer from '@google/markerclusterer';
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/webs";
import GoogleMapReact from 'google-map-react';
import { Dialog, DialogType, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { web } from '../Constants';
import { getLat, getLng, isPointInPolygon, WindowPopUp } from '../utils';
import { DialogLargeHeaderExample } from './DialogAddRef';
import { DialogAddRefOrganisme } from './DialogAddRefOrganisme';
import { DialogEvaluation } from './DialogEvaluation';
import Evaluer from './Evaluer';
import Filtrer from './Filtrer';
import { IMapContainerProps } from './IMapContainerProps';
import Inspection from './Inspection';
import styles from './ComparableMapSgmb.module.scss';
import MesBiens from './MesBiens';

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
                getDGI(_lat,_lng);
            }
            return rightClickMarker;
          });
        }, 200);
    });
  };
  
  //AnyReactComponent
  const Marker = ({ marker, lat, lng, text}) => <div className={ styles.marker }
  onClick={()=> {onMarkerClick(text, marker, "Valactif");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>;

  const Marker_organisme = ({ marker, lat, lng, text}) => <div className={ styles.markerOrganisme }
  onClick={()=> {onMarkerClick(text, marker, "l_ref_Org");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>; 
  
  const Marker_actif = ({ marker, lat, lng, text}) => <div className={ styles.markerActifs }
  onClick={()=> {onMarkerClick(text, marker, "l_actifs");}}
  onContextMenu={()=> onMarkerRightClick(marker)}></div>; 

  const Popup = ({ lat, lng}) =>
  <div className={styles.popupMarker}>
  <div className={styles.CloseDiv} onClick={()=> setPopupInfo(false)}>X</div>
  <div className={styles.arrowPopUp}></div>
  <span className={styles.spanInfo}>Référence: </span>{popupInfo.marker.Title}
  <br/>
        <div><span className={styles.spanInfo}>Type de Référence:</span><span>{typeDeBien}</span></div>
        
        <div><span className={styles.spanInfo}>Surface:</span><span>{popupInfo.marker.Surface_x0020_pond_x00e9_r_x00e9} m²</span></div>
        {/*<div><span className={styles.spanInfo}>Prix Unitaire:</span><span>{parseInt(popupInfo.marker.Prix_unitaire_de_la_reference).toFixed(0)} DH/m²</span></div>*/}
  <br/>      
  <a className={styles.rightFloat} href="#" onClick={(event)=> {
    event.preventDefault(); WindowPopUp("get info", "https://valactifcom.sharepoint.com/sites/SGMB/Lists/l_ref_Dexa/DispForm.aspx?ID="+popupInfo.marker.Id, "Valactif");}}>Voir plus...</a>
</div>;

  const PopupOrganisme = ({ lat, lng}) =>
    <div className={styles.popupMarker}>
      <div className={styles.CloseDiv} onClick={()=> setPopupInfo(false)}>X</div>
      <div className={styles.arrowPopUp}></div>
      <span className={styles.spanInfo}>Référence: </span>{popupInfo.marker.Title}
      <br/>
            <div><span className={styles.spanInfo}>Typologie du bien:</span><span>{typeDeBien}</span></div>
            
            <div><span className={styles.spanInfo}>Surface:</span><span>{popupInfo.marker.Surface_x0020_pond_x00e9_r_x00e9} m²</span></div>
            {/*<div><span className={styles.spanInfo}>Prix Unitaire:</span><span>{parseInt(popupInfo.marker.Prix_unitaire_de_la_reference).toFixed(0)} DH/m²</span></div>*/}
            
      <a className={styles.rightFloat} href="#" onClick={(event)=> {event.preventDefault(); WindowPopUp("get info", "https://valactifcom.sharepoint.com/sites/SGMB/Lists/Actifs/DispForm.aspx?ID="+popupInfo.marker.Id, "l_ref_Org");}}>Voir Plus</a>
    </div>;

  const PopupActif = ({ lat, lng}) =>
  <div className={styles.popupMarkerActif}>
    <div className={styles.CloseDiv} onClick={()=> setPopupInfo(false)}>X</div>
    <div className={styles.arrowPopUp}></div>
    <span className={styles.spanInfo}>Actif: </span>{popupInfo.marker.Title}
    <br/>
          {/* <div><span className={styles.spanInfo}>Portefeuille:</span><span>{popupInfo.marker.Portefeuille_Ref.Title}</span></div> */}
          <div><span className={styles.spanInfo}>Typologie du bien:</span><span>{popupInfo.marker.Typologie_x0020_de_x0020_bien} </span></div>
          {/* <br/>
    {popupInfo.marker.Lien?<a target="_blank" className={styles.rightFloat} href={popupInfo.marker.Lien.Url}>Voir Plus</a>:<></>} */}
  </div>;

  const PopupRight = ({ lat, lng , modaleTitle, url}) => 
    <div className={styles.popupRight}>
      <div className={styles.CloseDiv} onClick={()=> setPopupInfo(null)}>X</div>
      <br/>
      <div>
        <CopyToClipboard text={lat+","+lng} onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
          <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
        </CopyToClipboard>
        <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
      </div>
      <Filtrer dgi={DGI} buttonTitle="Analyser la zone" latlng={lat+","+lng} handleFilter={(items_dexa,items_org,distance, type_de_bien) => displayMarker(items_dexa,items_org,distance,type_de_bien)} ></Filtrer>
      <Evaluer dgi={DGI} buttonTitle="Evaluer le bien" latlng={lat+","+lng} handleEvaluer={(result) => {if(result!=null) {moreInfo(result);}}} ></Evaluer>
      <DialogEvaluation/>
      <br/>
      <DialogLargeHeaderExample/>
      <br/>
      <div className={styles.arrow}></div>
    </div>;
    
  const PopupRightOrganisme = ({ lat, lng , modaleTitle, url}) => {
    return 
  };

  const PopupRightValorisation = ({ lat, lng , modaleTitle, url}) => 
      <div className={styles.popupMarker}>
          <div className={styles.arrow}></div>
          <br/>
          <div>
            <CopyToClipboard text={lat+","+lng}
                onCopy={() => {setCopySuccess('Copied!');}} className={styles.Pointer}>
                <span>{parseFloat(lat).toFixed(5)},{parseFloat(lng).toFixed(5)}</span>
            </CopyToClipboard>
            <span className={styles.CopyToClipboardMsg}>&nbsp;{copySuccess}</span>
          </div>

          <Filtrer dgi={DGI} buttonTitle="Analyser la zone" latlng={lat+","+lng} handleFilter={(items_dexa,items_org,distance,type_de_bien) => displayMarker(items_dexa,items_org,distance,type_de_bien)} ></Filtrer>
          {<Evaluer dgi={DGI} buttonTitle="Evaluer le bien" latlng={lat+","+lng} handleEvaluer={(result) => moreInfo(result)} ></Evaluer>}
          <DialogEvaluation/>
          <br/>
          <DialogLargeHeaderExample/>
          <br/>
      </div>;

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

  function getDGI(lat,lng){
      web.lists.getByTitle("l_ref_DGI").items.getAll().then(res=>{
        var query = function(element) {
            return isPointInPolygon(lat, lng, element.Polygone);
        };
        const dgi = res.filter(query);
        setDGI(dgi);
    });
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
        " <a target='_blank' href='https://valactifcom.sharepoint.com/sites/SGMB/Lists/Valactif/DispForm.aspx?ID="+marker.Id+"'>Ajouter une référence2</a>"
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

  async function displayMarker (item_dexa:any, item_org:any, distance:any, type_de_bien) {
    setPopupInfo(null);
    setTypeDeBien(type_de_bien);
      await setDexa_markers(item_dexa);
      await setOrg_markers(item_org);
      setUpdatedMarker(true);
      var _prix_moyen = 0;
      var result = {
        dgi_zone:DGI,
        ref_dexa: item_dexa,
        ref_org: item_org,
        distance: distance,
        type_de_bien: type_de_bien,
      };
      setInformation(result);
      setPopOut(true);
  }
  async function displayMarker2 (item_dexa:any, item_org:any) {
    // console.log("item_dexa", item_dexa)
    // console.log("item_org", item_org)
    setTypeDeBien("Résidentiel");
    setPopupInfo(null);
    await setDexa_markers(item_dexa);
    await setOrg_markers(item_org);
    setUpdatedMarker(true);
    var result = {
      dgi_zone:DGI,
      ref_dexa: item_dexa,
      ref_org: item_org,
    };
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
      <GoogleMapReact
        bootstrapURLKeys={{ key: GoogleKey, libraries:['places'] }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        options={map => ({
          streetViewControl: true,
          mapTypeControl: true, 
          mapTypeControlOptions: {
            style: map.MapTypeControlStyle.DEFAULT,
            position: map.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
              map.MapTypeId.ROADMAP,
              map.MapTypeId.SATELLITE,
              map.MapTypeId.HYBRID
            ]
        },
        })}
      >
        {actifs?
          actifs.map(marker=>
            <Marker_actif lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title}  marker={marker}/>
          ):<></>
        }
        {updatedMarker&&org_markers?
            
          org_markers.map(marker=>
            <Marker_organisme lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>
          ):<></>
        }
        {updatedMarker&&dexa_markers?
          dexa_markers.map(marker=>
          <Marker lat={getLat(marker.Latitude_x002d_Longitude)} lng={getLng(marker.Latitude_x002d_Longitude)} text={marker.Title} marker={marker}/>
          ):<></>
        }

        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="Valactif"?
          <Popup
          lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)}
          lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)} />:<></>
        }

        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="l_ref_Org"?
          <PopupOrganisme
          lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)}
          lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)}
          />:<></>
        }
        {popupInfo&&popupInfo.marker&&popupInfo.from_list==="l_actifs"?
          <PopupActif
          lat={getLat(popupInfo.marker.Latitude_x002d_Longitude)}
          lng={getLng(popupInfo.marker.Latitude_x002d_Longitude)}
          />:<></>
        }
      </GoogleMapReact>
      <Stack horizontal>
        <div className={styles.rightFloatBien}>
          {/* {console.log("props.Reference", props)} */}
          <Inspection context={props.context} reference={props.Reference} handlerMesBiens={ async (items_actifs, filterd_list_dexa, filterd_list_org) => {
            await displayActifs(items_actifs);
            await displayMarker2(filterd_list_dexa,filterd_list_org);
          }} buttonTitle="Inspecter la zone"/>
        </div>
     </Stack>
    </div>
  );
}
