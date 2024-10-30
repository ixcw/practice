import request from '../utils/request';

export function query() {
  return request('/api/users');
}

export function getProduct() {
  return request('/v1/df/web/instruction/paperPreview');
}
