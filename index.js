/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

 const functions = require('firebase-functions');
 const {google} = require('googleapis');
 const {WebhookClient} = require('dialogflow-fulfillment');
 
 // Enter your calendar ID below and service account JSON below
 const calendarId = "3ldmuurcgf7kpali124mpcartc@group.calendar.google.com";
 const serviceAccount = {
  "type": "service_account",
  "project_id": "appointmentscheduler-tdrhfh",
  "private_key_id": "9eff2c2669db51d30f8faf35cedc1bcfe917fe87",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCi0ttwqq34Iocl\n6dxw0OnRsVdlXPPQEj9SFR7go1c65UtN0n9oiHUNvO0LknqVeNiehNWJjDJbM200\n+f4pFH/7pX7tZ4j+faGJp4KKJLZ513wMvsyssVSR4dfFEnZgrhL0lcYeaCiJaj6v\n5YMwjG5rZpDZb0vxp6lJWxZe12BqNyp1NVqWZ0JINVAMMDLg15MxybcayYrXhfK6\n9vWM63f/xQzPoMYO3wJKXzby1oICIu9qmpylPYW0av1eoDEfaBrg+oz/ImeuYO34\nxk5wSt6QRlbjymZmpIbpy3w0coDWUUgKX9zCirp0FLnF4ZeKqLdOoWzdhhsfSAWs\ngaJ/j6rVAgMBAAECggEAH/224N2gHdNG44Od7MqXTjx+U+ud+eFD8LA2p2NgdbFs\niMdVgifhe8gFeRMYI7shMJAf1o0lrbaee9yse8zL0pkzJZkEmR/896tiYhsRgUH9\n3RE17K5Q0/LgLpfQi3FYRxcQXJQRduJZm7zH+Gd3IIH/7sDH1pyfDcsoS40co/GP\ndBQGq5Uzhk/7CVrO7BnguZcXmof/B85e/8kXDzFd/meopllMN475s5+F4HI/1Ktf\nn3U7n4hA8GQzsy1aLdyyspKPh7S4nSXkADL+nQG4aC0cEPWBqD9K+c7Bkr6JXr2j\nTmqXS1xS3Rb/JES/vVOG49RqdzrFsdVFyUotwvznsQKBgQDZJXiDCzJeosfosaJa\n6ocM0Udy2/HBXFodBAEyDsjgawRNlRq+xGVBWxYPBPDAsBZSTGVJriwlEWg+a7Mu\n9q6/tSjco4ATnNG3h1ah6UHxXov+cnwdlFqBoFEFzSfbUdQB3+7F/2Ayb3fJ20EZ\nvTydjNXdHx/2c2Be7rTswF0prQKBgQC/9RmK/8M3ak+BZDMUnIuJJB+XqhmSl9eD\nPpPkRWpjp+zfRuQD9Cha3N8PYGumPnPKj04k5ShKhqhI4w9Bse+637BdsldCuZCz\nZ4uhbwql4eyuB5snGREvlQ1TwCX5M6wVWLKGDFiuVzjcVAoCt3A2MyvjzvSNu0OF\nF110L3P6yQKBgQDM366hLQo8AadNY3OEBeyfakDYHK4uujyHTcT2/r4GBtJLhJd0\nT4YdMJxSVV303u5gfZW++6bI3nCVHDY15Cah14GTEmv/lSDE4Nsa7iH6YjMBQfDa\nU6NE1AY9y/+DzOOTVT1J8BVJ4KOLfuMgLswm9b693uTgOKE/UEbBbQk5DQKBgB7f\nIFiGgbLr2hWJM93gv2Ay+xG9PZeh6/sjmU1hDJcybpoKIKmyHrteQlGKxEVcTesJ\n2Rt971jtByuRuOZr444+Y3LuN7J3fZoc0QwJe8Dp8NKcToufMHBinF4XzQOjF83n\nEe8VFT4UsQReT63YKqfM2wYsRpB0yYsiEtmYuCJhAoGBANChzzwPTozd83LRsciL\ncwnVkfgdNklSJjaBDBEav0LpKN9DSxgfgDDu+r8TBNexqSYH4vLmpl/onak1E6RS\nAB/OiffGMNAXauKsnODZzMriYKUDIh6dWAk5vSV7cyOZ1u4G6QrbtiryDQ+rYqkq\nf8uAOY45CcYtYIwFcJ6Crozq\n-----END PRIVATE KEY-----\n",
  "client_email": "appointment-scheduler@appointmentscheduler-tdrhfh.iam.gserviceaccount.com",
  "client_id": "103724628267198026290",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-scheduler%40appointmentscheduler-tdrhfh.iam.gserviceaccount.com"
}; // Starts with {"type": "service_account",...
 
 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
   email: serviceAccount.client_email,
   key: serviceAccount.private_key,
   scopes: 'https://www.googleapis.com/auth/calendar'
 });
 
 const calendar = google.calendar('v3');
 process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
 
 const timeZone = 'America/Los_Angeles';
 const timeZoneOffset = '-07:00';
 
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({ request, response });
   console.log("Parameters", agent.parameters);
   const appointment_type = agent.parameters.AppointmentType;
   function makeAppointment (agent) {
     // Calculate appointment start and end datetimes (end = +1hr from start)
     console.log("makeAppointment > Parameters", agent.parameters.date);
     const dateTimeStartStr = agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split(':')[0] + ":00:00" + timeZoneOffset;
     console.log("dateTimeStartStr: " + dateTimeStartStr);
     const dateTimeStart = new Date(Date.parse(dateTimeStartStr));
     const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
     const appointmentTimeString = dateTimeStart.toLocaleString(
       'en-US',
       { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
     );
 
     // Check the availibility of the time, and make an appointment if there is time on the calendar
     return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
       agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
     }).catch(() => {
       agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
     });
   }
 
   console.log("Creating the map");
   let intentMap = new Map();
   console.log("Inserting the item in the map");
   intentMap.set('Schedule appointment', makeAppointment);
   console.log("Handling the request with the agent");
   agent.handleRequest(intentMap).then(() => { /* do your stuff */ })
	.catch((error) => { console.error(error); });
 });
 
 
 
 function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
   console.log("Creating an event for DateStart:" + dateTimeStart + " DateEnd:" + dateTimeEnd + " AppType:" + appointment_type + "...");
   return new Promise((resolve, reject) => {
     calendar.events.list({
       auth: serviceAccountAuth, // List events for time period
       calendarId: calendarId,
       timeMin: dateTimeStart.toISOString(),
       timeMax: dateTimeEnd.toISOString()
     }, (err, calendarResponse) => {
       // Check if there is a event already on the Calendar
       console.log("Check for existing event at the same date and time");
       if (err || calendarResponse.data.items.length > 0) {
         reject(err || new Error('Requested time conflicts with another appointment'));
       } else {
         // Create event for the requested time period
         console.log("Creating the event");
         calendar.events.insert({ auth: serviceAccountAuth,
           calendarId: calendarId,
           resource: {summary: appointment_type +' Appointment', description: appointment_type,
             start: {dateTime: dateTimeStart},
             end: {dateTime: dateTimeEnd}}
         }, (err, event) => {
           err ? reject(err) : resolve(event);
           console.log("Error while creating the event");
         }
         );
       }
     });
   });
 }
