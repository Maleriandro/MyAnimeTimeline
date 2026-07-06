/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import moment from 'moment';

import {formatDate} from './Utils';
import {EntryStatus, ListEntry} from './MalApi';

export enum DisplayType {
    Box = 'box',
    Range = 'range',
}

export enum TitleLang {
    Romaji = 'romaji',
    English = 'english',
}

export const SupportedDisplayTypes = [DisplayType.Box, DisplayType.Range];
export const SupportedTitleLangs = [TitleLang.Romaji, TitleLang.English];

type VisJsRecord = { id: number; content: string; start: string; end: string, type?: 'box', className?: string };
type VisJsDataset = VisJsRecord[];

export const prepareVisJsDataset = (listEntries: ListEntry[], titleLang: TitleLang): VisJsDataset => {
    const dataset: VisJsDataset = [];
    for (let i = 0; i < listEntries.length; i++) {
        const entry = listEntries[i];
        const entryDetails = entry.node;
        const entryStatus = entry.list_status;

        if (entry.list_status.status !== EntryStatus.Completed) continue;

        let start: Date | null = null;
        let end: Date | null = null;


        if (entryStatus.start_date && !entryStatus.start_date.startsWith('0000-00-00')) {
            start = new Date(entryStatus.start_date);
        } else {
            start = new Date(entryStatus.updated_at);
        }

        const hasFinishDate = entryStatus.finish_date && !entryStatus.finish_date.startsWith('0000-00-00');
        if (hasFinishDate) {
            end = new Date(entryStatus.finish_date as string);
        } else {
            end = moment(start).add(1, 'day').toDate();
        }

        if (end < start) [start, end] = [end, start];

        const isSingleDay = start.toUTCString() === end.toUTCString();

        if (isSingleDay) {
            end = moment(start).add(1, 'day').toDate();
        }

        const title = titleLang === TitleLang.English && entryDetails.alternative_titles.en
            ? entryDetails.alternative_titles.en
            : entryDetails.title;

        const record: VisJsRecord = {
            id: i,
            content: title,
            start: formatDate(start),
            end: formatDate(end),
        };

        if (isSingleDay || !hasFinishDate) {
            record.type = 'box';
            record.className = 'single-day-item';
        }

        if (entryDetails.num_episodes <= 3) {
            record.className = record.className ? `${record.className} one-episode-anime` : 'one-episode-anime';
        }

        dataset.push(record);
    }
    return dataset.sort((a, b) => b.end.localeCompare(a.end));
};

let timeline: any | null = null;
const tooltipMouseMoveListener = (event: MouseEvent) => {
    const tooltip = document.getElementById('tooltip') as HTMLDivElement;
    if (tooltip) {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
    }
};

export const drawVisJsTimeline = (dataset: VisJsDataset, displayType: DisplayType, onSelect: (title: string | null) => void) => {
    const container = document.getElementById('visualization');

    if (!container) {
        console.error('Container not found!');
        return;
    }

    if (timeline) {
        timeline.destroy();
        container.removeEventListener('mousemove', tooltipMouseMoveListener);
    }

    const items = new vis.DataSet(dataset);
    const options = {
        height: '100%',
        align: 'left',
        zoomMax: 31536000000 * 20,
        zoomMin: 86400000 * 10,
        type: displayType,
    };

    timeline = new vis.Timeline(container, items, options);
    timeline.on('select', (properties: { items: (string | number)[] }) => {
        if (properties.items.length > 0) {
            const selectedItem = items.get(properties.items[0]) as VisJsRecord;
            if (selectedItem) {
                onSelect(selectedItem.content);
            }
        } else {
            onSelect(null);
        }
    });
    
    if (displayType === DisplayType.Range) {
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
                tooltip.innerText = (items.get(itemId) as VisJsRecord)?.content || '';
            }
        });

        // Listen for mouseMove event to position the tooltip
        container.addEventListener('mousemove', tooltipMouseMoveListener);

        // Listen for mouseOut event to hide the tooltip
        timeline.on('itemout', () => {
            const tooltip = document.getElementById('tooltip') as HTMLDivElement;
            tooltip.style.display = 'none';
        });
    }

};
