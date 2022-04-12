import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import { ActionButton, Checkbox, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, IDropdownStyles, Label, Panel, PrimaryButton, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import { web } from '../Constants';

import { IMesComparablesProps } from "./IMesComparablesProps";
import styles from './MapComparablesSgmb.module.scss';
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

function MesBiens (props:IMesComparablesProps){}