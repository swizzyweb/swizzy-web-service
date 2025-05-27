import http from 'http';
import https from 'https';

export type AnyServer = http.Server | https.Server;