# HA-Lovelace-Strand

Script to change the look of Home Assistant.

![preview](https://user-images.githubusercontent.com/38769179/118538733-ddb6aa00-b74e-11eb-95fb-1ca2a32c3712.png)



The normal menu is enlarged andmoved to the bottom. Notifications appear in the top bar.

Note:
First line has **ADMIN_OVERRIDE** variable. Setting this to "true" removes some buttons to make a more clean look.


**To install**:
  Go to configuration
    => Lovelace Dashboards
      =>  Resources
          Add the following resources:
          
    https://fonts.googleapis.com/css2?family=Exo&display=swap
    type: Stylesheet

    https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap
    type: Stylesheet

    /local/strand.js
    type: Javascript module
          
  Download the "strand.js" file and add it to the 'www' folder.

**To load the ui**:
Go to the dashboard and reload the page.

**Help**

For questions visit the post on the [Home Assistant community](https://community.home-assistant.io/t/dashboard-design-for-tablet/308095).

**Todo**:
- Make easy install
- Add customization options
- Create night mode desing
- Create sleep mode design
