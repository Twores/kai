/**
 * API сервис для работы с backend
 * Базовый URL берется из переменной окружения REACT_APP_API_URL
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

/**
 * Базовая функция для выполнения запросов
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log(`[API] ${config.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body) : '');

  try {
    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Если не получилось распарсить JSON, значит ответ не JSON
      console.error(`[API Error] ${url}: Not a JSON response`);
      console.error(`[API Error] Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
      throw new Error('Сервер вернул не JSON ответ. Возможно неправильный URL API или сервер не запущен.');
    }

    if (!response.ok) {
      const errorMessage = data.detail || data.message || `HTTP ${response.status}`;
      console.error(`[API Error] ${url}:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`[API Success] ${url}:`, data);
    return data;
  } catch (error) {
    if (error.message.startsWith('Сервер вернул не JSON ответ')) {
      throw error;
    }
    console.error(`[API Error] ${url}:`, error);
    throw error;
  }
}

// ==================== АВТОРИЗАЦИЯ ====================

/**
 * Авторизация пользователя
 */
export async function login(username, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ==================== ЗАДАНИЯ ====================

/**
 * Получить список заданий
 */
export async function getTasks() {
  return apiRequest('/api/tasks');
}

/**
 * Создать новое задание
 */
export async function createTask(taskData) {
  return apiRequest('/api/tasks/create', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Обновить задание
 */
export async function updateTask(taskData) {
  return apiRequest('/api/tasks/update', {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

/**
 * Удалить задание
 */
export async function deleteTask(taskId) {
  return apiRequest(`/api/tasks/delete?task_id=${taskId}`, {
    method: 'DELETE',
  });
}

// ==================== АВТОМАТИЗАЦИЯ ====================

/**
 * Запустить автоматизацию
 */
export async function startAutomation(taskIds, parallel = false, maxConcurrency = 5) {
  return apiRequest('/api/automation/start', {
    method: 'POST',
    body: JSON.stringify({
      taskIds,
      parallel,
      maxConcurrency,
    }),
  });
}

/**
 * Остановить автоматизацию
 */
export async function stopAutomation() {
  return apiRequest('/api/automation/stop', {
    method: 'POST',
  });
}

// ==================== НАСТРОЙКИ ====================

/**
 * Получить настройки
 */
export async function getSettings() {
  return apiRequest('/api/settings');
}

/**
 * Сохранить настройки
 */
export async function saveSettings(settingsData) {
  return apiRequest('/api/settings', {
    method: 'POST',
    body: JSON.stringify(settingsData),
  });
}

/**
 * Проверить подключение
 */
export async function testConnection(connectionData) {
  return apiRequest('/api/connection/test', {
    method: 'POST',
    body: JSON.stringify(connectionData),
  });
}

// ==================== СПРАВОЧНИКИ ====================

/**
 * Получить все справочники
 */
export async function getReferences() {
  return apiRequest('/api/references');
}

/**
 * Добавить элемент в справочник
 */
export async function addReference(type, value, description = '') {
  return apiRequest('/api/references/add', {
    method: 'POST',
    body: JSON.stringify({
      type,
      value,
      description,
    }),
  });
}

/**
 * Удалить элемент из справочника
 */
export async function deleteReference(type, itemId) {
  return apiRequest('/api/references/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      type,
      itemId,
    }),
  });
}

