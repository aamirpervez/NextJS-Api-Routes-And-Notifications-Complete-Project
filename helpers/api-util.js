import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

export function buildFeedbackPath() {
  console.log(path.join(process.cwd(), 'data', 'eventsData.json'))
  return path.join(process.cwd(), 'data', 'eventsData.json');
}

export function extractFeedback(filepath) {
  const fileData = fs.readFileSync(filepath);
  const data = JSON.parse(fileData);
  return data;
}

export async function getAllEvents() {
  // const response = await fetch('https://nextjs-course-c81cc-default-rtdb.firebaseio.com/events.json');
  // const data = await response.json();

  //store in the database...
  const filepath = await buildFeedbackPath();
  const data = await extractFeedback(filepath);

  const events = [];

  for (const key in data) {
    events.push({
      id: key,
      ...data[key]
    });
  }

  return events;
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents();
  return allEvents.filter((event) => event.isFeatured);
}

export async function getEventById(id) {
  const allEvents = await getAllEvents();
  return allEvents.find((event) => event.id === id);
}

export async function getFilteredEvents(dateFilter) {
  const { year, month } = dateFilter;

  const allEvents = await getAllEvents();

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
  });

  return filteredEvents;
}

export async function connectDatabase() {
  const client = await MongoClient.connect('your mongodb db url');
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client, collection, sort) {

  const db = client.db();
  const comments = await db.collection(collection)
    .find()
    .sort({ sort: -1 })
    .toArray();

  return comments;
}