/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import Promise from 'bluebird';

export enum ListType {
    Anime = 'anime',
    Manga = 'manga',
}

export const SupportedListTypes = [ListType.Anime, ListType.Manga];

export enum EntryStatus {
    Completed = 'completed',
    PlanToWatch = 'plan_to_watch',
    Watching = 'watching',
}

interface PagingResponse {
    data: ListEntry[];
    paging?: {
        next?: string;
        previous?: string;
    }
}

export interface ListEntry {
    node: {
        id: number;
        title: string;
        main_picture: {
            medium: string;
            large: string;
        };
    };
    list_status: {
        status: string;
        score: number;
        num_episodes_watched: number;
        is_rewatching: boolean;
        updated_at: string;
        start_date?: string;
        finish_date?: string;
    };
}

export const getMalListEntries = (username: string, listType: ListType): Promise<ListEntry[]> => {
    // UNO NUNCA DEBERÍA USAR UN CORS PROXY PÚBLICO EN PRODUCCIÓN, PERO LA API DE MAL NO SOPORTA CORS.
    // COMO LA API DE MAL NO ES DEMASIADO RELEVANTE, Y SU FILTRACION NO IMPLICA RIESGOS DE SEGURIDAD, 
    // USO EL PROXY CORS PÚBLICO PARA SIMPLIFICAR LA IMPLEMENTACIÓN, Y PODER SERVIR LA PAGINA
    // DE MANERA ESTATICA DESDE GITHUB PAGES.
    
    const CORS_PROXY = 'https://cors-anywhere.com/'; // Proxy CORS público
    const CLIENT_ID = '5492055435a9fdc3d76e9813719c505a';
    
    // Función auxiliar para realizar fetch recursivo de todas las páginas
    const fetchAllPages = async (url: string, accumulatedData: ListEntry[] = []): Promise<ListEntry[]> => {
        // Si la URL no tiene el proxy al principio, añadirlo (para la URL inicial y las de "next")
        // La API devuelve la URL completa en 'paging.next', pero necesitamos pasarla por el proxy
        const actualUrl = url.includes(CORS_PROXY) ? url : CORS_PROXY + url.replace(/^https?:\/\//, '');

        const response = await fetch(actualUrl, {
            method: 'GET',
            headers: {
                'X-MAL-CLIENT-ID': CLIENT_ID
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching list: ${response.statusText}`);
        }

        const json: PagingResponse = await response.json();
        const newData = accumulatedData.concat(json.data);

        // Si hay una siguiente página, llamar recursivamente
        if (json.paging && json.paging.next) {
            await Promise.delay(2000); // Esperar 1 segundo antes de la siguiente solicitud para evitar rate limiting
            return fetchAllPages(json.paging.next, newData);
        }

        return newData;
    };

    const initialRequestUrl = `api.myanimelist.net/v2/users/${username}/${listType}list?fields=list_status&limit=1000&nsfw=true`;
    
    return Promise.resolve(fetchAllPages(initialRequestUrl));
};
