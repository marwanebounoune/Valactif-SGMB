
import * as pnp from "sp-pnp-js";
export const web =  pnp.sp.web;
export const MAX_SCORE:number = 5;
export const MIN_SCORE:number = 1;
export const RATIO:number = 15/100;
export const SURFACE_COEFFICIENT:number = 1;
export const SITUATION_GENERAL_COEFFICIENT:number = 2;
export const STANDING_APPARTEMENT_COEFFICIENT:number = 1;
export const STANDING_IMMEUBLE_COEFFICIENT:number =1;
export const DISTANCE_START_FILTRAGE:number = 1000;//1km
export const DISTANCE_END_FILTRAGE:number = 3000;//1km
export const DISTANCE_START_EVALUATION:number = 250;//250m
export const DISTANCE_END_EVALUATION:number = 750;//750m
export const DGI_COEFFICIENT_FILTER:number = 0.35;
export const siteRelativeUrl = "/sites/SGMB/";
export const webPartListId = "f92bf067-bc19-489e-a556-7fe95f508720";