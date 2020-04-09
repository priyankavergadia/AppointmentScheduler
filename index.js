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
 
 below code is modified by ViKi Vyas(in English V.K. Vyas), 
 changelog
 1) it can work with any timezone. as old code had problme to work with + timezone.
 2) agent was replying time to near by rounding time e.g 2:30 was rounded to 2:00. appoiment booking was ok but agent reply had problem.
 3) agent reply after booking was made more like human. 
 */

 'use strict';

 const functions = require('firebase-functions');
 const {google} = require('googleapis');
 const {WebhookClient} = require('dialogflow-fulfillment');
 
 // Enter your calendar ID below and service account JSON below
 const calendarId = "<Add your calendar ID here>"
 const serviceAccount = {<Add your service account details here>}; // Starts with {"type": "service_account",...
 
 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
   email: serviceAccount.client_email,
   key: serviceAccount.private_key,
   scopes: 'https://www.googleapis.com/auth/calendar'
 });
 
 const calendar = google.calendar('v3');
 process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
 
 const timeZone = '<Your time zone e.g America/Los_Angeles or Asia/Colombo>';
 const timeZoneOffset = 'Your time + /- to gmt 000 e.g -07:00 or +5:30';
 
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({ request, response });
   const appointment_type = agent.parameters.AppointmentType
   function makeAppointment (agent) {
     // Calculate appointment start and end datetimes (end = +1hr from start)
    const AppointmentDate = agent.parameters.date.split('T')[0];
    const AppointmentTime = agent.parameters.time.split('T')[1].substr(0,8);
    const dateTimeStart = new Date(AppointmentDate + 'T' + AppointmentTime+timeZoneOffset);
    const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
    
     // Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
       agent.add(`Let me see if we can fit you in on ${AppointmentDate} at ${AppointmentTime}! Yes It is fine!.`);
     }).catch(() => {
       agent.add(`I'm sorry, there are no slots available for ${AppointmentDate} at ${AppointmentTime}.`);
     });
   }
 
   let intentMap = new Map();
   intentMap.set('Schedule Appointment', makeAppointment);
   agent.handleRequest(intentMap);
 });

function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
   return new Promise((resolve, reject) => {
     calendar.events.list({
       auth: serviceAccountAuth, // List events for time period
       calendarId: calendarId,
       timeMin: dateTimeStart.toISOString(),
       timeMax: dateTimeEnd.toISOString()
     }, (err, calendarResponse) => {
       // Check if there is a event already on the Calendar
       if (err || calendarResponse.data.items.length > 0) {
         reject(err || new Error('Requested time conflicts with another appointment'));
       } else {
         // Create event for the requested time period
         calendar.events.insert({ auth: serviceAccountAuth,
           calendarId: calendarId,
           resource: {summary: appointment_type +' Appointment', description: appointment_type,
             start: {dateTime: dateTimeStart},
             end: {dateTime: dateTimeEnd}}
         }, (err, event) => {
           err ? reject(err) : resolve(event);
         }
         );
       }
     });
   });
 }
