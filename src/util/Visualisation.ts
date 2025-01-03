/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import moment from 'moment';

import {formatDate} from './Utils';
import {EntryStatus, ListEntry} from './MalApi';

export enum DisplayType {
    Point = 'point',
    Box = 'box',
    Range = 'range',
}

export const SupportedDisplayTypes = [DisplayType.Point, DisplayType.Box, DisplayType.Range];

type VisJsRecord = { id: number; content: string; start: string; end: string }
type VisJsDataset = VisJsRecord[]

export const prepareVisJsDataset = (listEntries: ListEntry[]): VisJsDataset => {
    const dataset: VisJsDataset = [];
    for (let i = 0; i < listEntries.length; i++) {
        const entry = listEntries[i];
        const entryDetails = entry.node;
        const entryStatus = entry.list_status;

        if (entry.list_status.status !== EntryStatus.Completed) continue;

        let start: Date | null = null;
        let end: Date | null = null;


        if (entryStatus.start_date && !entryStatus.start_date.startsWith('0000-00-00')) {
            //If start date exists, use it
            start = new Date(entryStatus.start_date);
        } else {
            //If start date does not exist, use updated_at
            start = new Date(entryStatus.updated_at);
        }

        if (entryStatus.finish_date && !entryStatus.finish_date.startsWith('0000-00-00')) {
            //If finish date exists, use it
            end = new Date(entryStatus.finish_date);
        } else {
            //If finish date does not exist, use start + 1 day
            end = moment(start).add(1, 'day').toDate();
        }

        //If end date is before start date, swap them
        if (end < start) [start, end] = [end, start];

        //If start date is the same as end date, add 1 day to end date
        if (start.toUTCString() === end.toUTCString()) {
            end = moment(start).add(1, 'day').toDate();
        }

        const record = {
            id: i,
            content: entryDetails.title,
            start: formatDate(start),
            end: formatDate(end),
        };
        dataset.push(record);
    }
    return dataset.sort((a, b) => b.end.localeCompare(a.end));
};

export const drawVisJsTimeline = (dataset: VisJsDataset, displayType: DisplayType) => {
    const container = document.getElementById('visualization');

    if (!container) {
        console.error('Container not found!');
        return;
    }

    const items = new vis.DataSet(dataset);
    const options = {
        height: '100%',
        align: 'left',
        zoomMax: 31536000000 * 20,
        zoomMin: 86400000 * 10,
        type: displayType,
    };

    const timeline = new vis.Timeline(container, items, options);

    timeline.on('itemover', (properties: { item: number | string, event: MouseEvent }) => {
        const itemId = properties.item;

        // Get the item element
        let itemElement = properties.event.target as HTMLElement;
        //Sometimes the event target is not the item itself, but a parent element
        if (!itemElement.classList.contains('vis-item-content')) {
            itemElement = itemElement.getElementsByClassName('vis-item-content')[0] as HTMLElement;
        }

    
        const parentElement = itemElement.parentElement;
      
        // Check if the content is overflowing (this means the text is too long to fit in the box)
        if (parentElement && itemElement.clientWidth > parentElement.clientWidth) {
            const tooltip = document.getElementById('tooltip') as HTMLDivElement;
            tooltip.style.display = 'block';
            tooltip.innerText = items.get(itemId)?.content || '';
        }
      });
      
      // Listen for mouseMove event to position the tooltip
      container.addEventListener('mousemove', (event: MouseEvent) => {
        const tooltip = document.getElementById('tooltip') as HTMLDivElement;
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      });
      
      // Listen for mouseOut event to hide the tooltip
      timeline.on('itemout', () => {
        const tooltip = document.getElementById('tooltip') as HTMLDivElement;
        tooltip.style.display = 'none';
      });

};
