import axios from 'axios';

let base = '';

export const upload = (params, config) => { return axios.post(`${base}/app/upload/`, params, config) };
export const get_table = params => { return axios.post(`${base}/app/get_table/`, params) };
export const get_enb_tree = params => { return axios.get(`${base}/app/get_enb_tree/`, { params: params }) };
export const get_choice = params => { return axios.get(`${base}/app/get_choice/`, { params: params }) };
export const get_table_limit = params => { return axios.post(`${base}/app/get_table_limit/`, params) };
export const export_data = (params, config) => { return axios.get(`${base}/app/export_data/`, { params: params }, config) };
export const download = params => { return axios.get(`${base}/app/download/`, { params: params }) };
export const analyze = params => { return axios.get(`${base}/app/analyze/`, { params: params }) };
export const get_result = params => { return axios.get(`${base}/app/get_result/`, { params: params }) };
export const job_manage = params => { return axios.get(`${base}/app/job_manage/`, { params: params }) };
export const job_kill = params => { return axios.get(`${base}/app/job_manage/${params.task_id}/kill/`) };
export const analyze_one = params => { return axios.get(`${base}/app/analyze_one/`, { params: params }) };
export const compute_cluster = params => { return axios.post(`${base}/app/compute_cluster/`, params) };
