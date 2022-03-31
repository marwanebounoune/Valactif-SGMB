import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'InjectionCssApplicationCustomizerStrings';

const LOG_SOURCE: string = 'InjectionCssApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IInjectionCssApplicationCustomizerProperties {
  // This is an example; replace with your own property
  cssurl: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class InjectionCssApplicationCustomizer
  extends BaseApplicationCustomizer<IInjectionCssApplicationCustomizerProperties> {

  @override
  public async onInit(): Promise<void> {
    const head: any = document.getElementsByTagName("body")[0] || document.documentElement;
    let customStyle: HTMLLinkElement = document.createElement("link");
    /* hide page site contents */
    var currentPageUrl = this.context.pageContext.site.serverRequestPath;
    console.log("currentPageUrl", currentPageUrl);

    /* change favicon */
    var favicon = document.querySelector("link[rel*='icon']") as HTMLElement || document.createElement('link') as HTMLElement;
    const faviconUrl: string= "https://valactifcom.sharepoint.com/sites/SGMB/SiteAssets/siteIcon.ico";
    console.log("before favicon", favicon);
    favicon.setAttribute('type', 'image/x-icon');

    favicon.setAttribute('rel', 'shortcut icon');

    favicon.setAttribute('href', faviconUrl);
    document.getElementsByTagName("head")[0].appendChild(favicon);
    /* hide app launcher and settings gear*/
    const currentUser: any = this.context.pageContext.user;
    console.log("currentUser", currentUser);
    var email: string = currentUser.email.toString();
    if(email != "alami.saad@valactif.com" && email != "bounoune.marwane@valactif.com"){
      
      const cssUrl: string = this.properties.cssurl;
      if (cssUrl) {
        // inject the style sheet
        customStyle.href = cssUrl;
        customStyle.rel = "stylesheet";
        customStyle.type = "text/css";
        head.insertAdjacentElement("beforeEnd", customStyle);
      }
      if(currentPageUrl === "/_layouts/15/viewlsts.aspx"){
       
        customStyle.href = "https://valactifcom.sharepoint.com/sites/SGMB/SiteAssets/hideSiteContent.css";
        customStyle.rel = "stylesheet";
        customStyle.type = "text/css";
        head.insertAdjacentElement("beforeEnd", customStyle);
        window.location.href = "https://valactifcom.sharepoint.com/sites/SGMB/SitePages/Home.aspx";
      }               
    return Promise.resolve();
  }
}
}
  