I assume that before you are using my code you have created needed INTENT with proper name of it (MakeAppointment).

# Appointment Scheduler

## Setup Instructions
### Dialogflow and Fulfillment Setup

#### Service Account Setup
1. In [Dialogflow's console](https://console.dialogflow.com), go to settings ⚙ and under the general tab, you'll see the project ID section with a Google Cloud link to open the Google Cloud console. Open **Google Cloud**.
1. In the Cloud console, go to the menu icon **☰ > APIs & Services > Library**
1. Select **Google Calendar API** and then **Enable** to enable the API on your cloud project.
1. Under the menu icon **☰ > APIs & Services > Credentials > Create Credentials > Service Account Key**.
1. Under **Create service account key**, select **New Service Account** from the dropdown and enter `AppointmentCalendar` for the name and click **Create**. In the popup, select **Create Without Role**.
    + JSON file will be downloaded to your computer that you will need in the setup sections below.

#### DMV Appointment Calendar Setup
1. Open the JSON file that was downloaded in the Service Account Setup section and copy the email address from "client_email": "**ABCD@ProjectID.iam.gserviceaccount.com**", 
1. [Open Google Calendar](https://calendar.google.com). On the left, next to **Add a friend's calendar** click the **+** and select **New Calendar**
1. Enter `Appointment Calendar` for the name of the calendar and select **Create Calendar**. Next, go to the `Appointment Calendar` calendar that will appear on the left column.
1. Paste the email copied from the previous step into the **Add people** field of the **Share with specific people** section and then select **Make changes to events** in the permissions dropdown and select **Send**.
1. While still in Settings, scroll down and copy the **Calendar ID** in the **Integrate Calendar** section.

#### Add Service Account and Calendar ID to Fulfillment
Go to the `index.js` file in [Dialogflow's Fulfillment section](https://console.dialogflow.com/api-client/#/agent//fulfillment)

Take the **Calendar ID** copied from the prior section and replace `<Add your calendar ID here>` on line 30 of `index.js`.
```js
// Ex:
const calendarId = 'xxxxxxxxxxxxxxxxxxx0@group.calendar.google.com';
```
Next copy the all contents of the JSON file downloaded in the Service Account Setup section and replace <Add your service account details here> with it on line 30 of `index.js` `const serviceAccount = `. Starts with {"type": "service_account",...  and Ends With "client_x509_cert_url": "Your Project Google API URL "}; It will look like given example below.
```js
//Ex: 
 const serviceAccount = {"type": "service_account",
  "project_id": "<Your-project_id>",
  "private_key_id": "<Your-private_key_id>",
  "private_key": "<Your-private_key> As like this -----BEGIN PRIVATE KEY-----\nViral...Kirankumar...Vyas==\n-----END PRIVATE KEY-----\n",
  "client_email": "<Your Service Account ID> As like this ABCD@ProjectID.iam.gserviceaccount.com",
  "client_id": "<Your Client ID>",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "Your Project Google API URL"};
```

## Time Zone Setting
 
 1. Make sure that `const timeZone` = 'Your time zone e.g America/Los_Angeles or Asia/Colombo', Some time zone are named diffrent or merged
 https://cloud.google.com/dataprep/docs/html/Supported-Time-Zone-Values_66194188 and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 1. Also make sure that `const timeZoneOffset` = 'Your time + /- to gmt 000 e.g -07:00 or +5:30'; 
    
Click **Deploy** at at the bottom of the page.


## Running the sample
In [Dialogflow's console](https://console.dialogflow.com), in the simulator on the right, query your Dialogflow agent with `Set an appointment at 4pm tomorrow for drivers license` and respond to the questions your Dialogflow agent asks.   After getting the required information, an appointment will be added to the "Appointment Calendar" calendar.

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md.

## License
See [LICENSE](LICENSE).

## Disclaimer
This code is a sample, should not be used for any potential production workloads.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
