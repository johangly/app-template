# Guía Completa de Testing

> Cómo escribir tests efectivos para React y Node.js

## 📋 ÍNDICE

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Testing en Frontend (React)](#testing-en-frontend-react)
3. [Testing en Backend (Node.js)](#testing-en-backend-nodejs)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Casos Comunes](#casos-comunes)
6. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Conceptos Fundamentales

### ¿Por qué testear?

1. **Confianza**: Sabes que tu código funciona
2. **Refactoring**: Puedes cambiar código sin miedo a romper algo
3. **Documentación**: Los tests muestran cómo usar el código
4. **Debugging**: Los tests te ayudan a encontrar bugs
5. **Diseño**: Escribir tests te obliga a escribir código más limpio

### Tipos de Tests

```
Pirámide de Testing:

        /\
       /  \     E2E Tests (Pocos)
      /----\     Testean flujos completos
     /      \
    /--------\   Integration Tests (Medianos)
   /          \   Testean módulos juntos
  /------------\
 /              \  Unit Tests (Muchos)
/----------------\  Testean funciones aisladas
```

**Unit Tests (Tests Unitarios):**
- Testean una función/componente aislado
- Rápidos de ejecutar
- Fáciles de escribir
- Mayor cantidad

**Integration Tests (Tests de Integración):**
- Testean varios módulos trabajando juntos
- Testean API endpoints
- Verifican flujos completos

**E2E Tests (End-to-End):**
- Testean la aplicación completa
- Simulan un usuario real
- Usan herramientas como Cypress o Playwright

---

## Testing en Frontend (React)

### Herramientas que Usamos

- **Jest**: Framework de testing
- **React Testing Library**: Utilidades para testear componentes React
- **user-event**: Simular interacciones de usuario
- **jest-dom**: Matchers adicionales para DOM

### Estructura de un Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MiComponente from './MiComponente';

// 1. DESCRIBE: Agrupa tests relacionados
describe('MiComponente', () => {
  
  // 2. BEFORE EACH: Se ejecuta antes de cada test
  beforeEach(() => {
    // Setup inicial
  });
  
  // 3. TEST: Define un caso de prueba
  it('debería mostrar el título', () => {
    // Arrange (Preparar)
    render(<MiComponente title="Hola" />);
    
    // Act (Actuar)
    const titulo = screen.getByText('Hola');
    
    // Assert (Verificar)
    expect(titulo).toBeInTheDocument();
  });
  
  it('debería llamar onClick cuando se hace clic', async () => {
    // Arrange
    const handleClick = jest.fn();
    render(<MiComponente onClick={handleClick} />);
    
    // Act
    await userEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Renderizado de Componentes

```typescript
import { render, screen } from '@testing-library/react';

// Render básico
render(<MiComponente />);

// Render con props
render(<MiComponente name="John" age={30} />);

// Render con contexto
render(
  <AuthProvider>
    <MiComponente />
  </AuthProvider>
);

// Render con router
render(
  <MemoryRouter>
    <MiComponente />
  </MemoryRouter>
);
```

### Búsqueda de Elementos

```typescript
// Por texto
screen.getByText('Hola Mundo');           // Exacto
screen.getByText(/hola/i);                // Regex (case insensitive)

// Por rol (accesibilidad)
screen.getByRole('button');               // Botón
screen.getByRole('textbox');              // Input de texto
screen.getByRole('heading');              // Título (h1-h6)
screen.getByRole('alert');                // Alerta

// Por placeholder
screen.getByPlaceholderText('Email');

// Por label
screen.getByLabelText('Contraseña');

// Por test id
screen.getByTestId('user-card');

// Variantes:
// getBy*    -> Error si no encuentra
// queryBy*  -> null si no encuentra
// findBy*   -> Async, espera a que aparezca
// getAllBy* -> Array de elementos
```

### Interacciones con Usuario

```typescript
import userEvent from '@testing-library/user-event';

// Click
await userEvent.click(screen.getByRole('button'));

// Escribir en input
await userEvent.type(screen.getByRole('textbox'), 'Hola Mundo');

// Seleccionar opción
await userEvent.selectOptions(
  screen.getByRole('combobox'),
  'opcion-1'
);

// Check/Uncheck
await userEvent.click(screen.getByRole('checkbox'));

// Subir archivo
await userEvent.upload(
  screen.getByLabelText('Subir archivo'),
  new File(['contenido'], 'test.png', { type: 'image/png' })
);

// Limpiar input
await userEvent.clear(screen.getByRole('textbox'));

// Hover
await userEvent.hover(screen.getByText('Tooltip'));
await userEvent.unhover(screen.getByText('Tooltip'));
```

### Aserciones Comunes

```typescript
// Elemento en documento
expect(element).toBeInTheDocument();

// Visible
expect(element).toBeVisible();

// Habilitado/Deshabilitado
expect(button).toBeEnabled();
expect(button).toBeDisabled();

// Atributos
expect(input).toHaveAttribute('type', 'email');
expect(input).toHaveClass('input-error');
expect(input).toHaveValue('test@example.com');

// Texto
expect(element).toHaveTextContent('Hola');
expect(element).toHaveTextContent(/hola/i);

// Cantidad
expect(items).toHaveLength(5);

// Funciones mock
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg');

// Formularios
expect(screen.getByRole('form')).toHaveFormValues({
  email: 'test@example.com',
  password: 'secret'
});
```

### Testing de Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('debería inicializar en 0', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });
  
  it('debería incrementar', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  it('debería inicializar con valor personalizado', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });
});
```

### Testing de Contexto

```typescript
import { render, screen } from '@testing-library/react';
import { AuthContext } from './AuthContext';
import UserProfile from './UserProfile';

const renderWithAuth = (user = null) => {
  return render(
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      <UserProfile />
    </AuthContext.Provider>
  );
};

describe('UserProfile', () => {
  it('muestra mensaje cuando no hay usuario', () => {
    renderWithAuth(null);
    
    expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
  });
  
  it('muestra nombre del usuario', () => {
    renderWithAuth({ name: 'John', email: 'john@example.com' });
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### Testing de Formularios

```typescript
describe('LoginForm', () => {
  it('envía datos del formulario', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // Llenar formulario
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    
    await userEvent.type(
      screen.getByLabelText(/contraseña/i),
      'password123'
    );
    
    // Enviar
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Verificar
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  it('muestra error de validación', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    
    // Enviar vacío
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Verificar error
    expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
  });
});
```

### Testing Asíncrono

```typescript
describe('UserList', () => {
  it('muestra usuarios después de cargar', async () => {
    render(<UserList />);
    
    // Verificar loading
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    
    // Esperar a que aparezcan los usuarios
    const users = await screen.findByText('John Doe');
    expect(users).toBeInTheDocument();
    
    // O usando waitFor
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });
  
  it('maneja error de carga', async () => {
    // Mock de error
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    
    render(<UserList />);
    
    // Esperar mensaje de error
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
```

### Mocks

```typescript
// Mock de módulo
jest.mock('../services/api', () => ({
  fetchUsers: jest.fn(() => Promise.resolve([{ id: 1, name: 'John' }]))
}));

// Mock de función
const mockFn = jest.fn();
mockFn.mockReturnValue('valor');
mockFn.mockResolvedValue({ data: [] }); // Para async
mockFn.mockRejectedValue(new Error('Error')); // Para errores

// Restaurar mocks
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
    ok: true,
  })
);
```

---

## Testing en Backend (Node.js)

### Herramientas que Usamos

- **Jest**: Framework de testing
- **Supertest**: Testing de endpoints HTTP
- **testEnvironment**: node (para backend)

### Estructura de un Test

```typescript
import request from 'supertest';
import app from '../app';

describe('GET /api/users', () => {
  it('debería retornar lista de usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### Testing de Endpoints

```typescript
describe('Users API', () => {
  describe('GET /api/users', () => {
    it('retorna lista de usuarios', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body.data).toBeInstanceOf(Array);
    });
    
    it('requiere autenticación', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
  
  describe('POST /api/users', () => {
    it('crea un nuevo usuario', async () => {
      const newUser = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201);
      
      expect(res.body.email).toBe(newUser.email);
      expect(res.body).not.toHaveProperty('password');
    });
    
    it('valida datos requeridos', async () => {
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'John' }) // Falta email y password
        .expect(400);
    });
  });
  
  describe('PUT /api/users/:id', () => {
    it('actualiza usuario existente', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'John Updated' })
        .expect(200);
      
      expect(res.body.name).toBe('John Updated');
    });
    
    it('retorna 404 si usuario no existe', async () => {
      await request(app)
        .put('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' })
        .expect(404);
    });
  });
  
  describe('DELETE /api/users/:id', () => {
    it('elimina usuario', async () => {
      await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      // Verificar que ya no existe
      await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
```

### Setup y Teardown

```typescript
// tests/setup.js
import db from '../database';

beforeAll(async () => {
  // Conectar a base de datos de test
  await db.connect();
});

afterAll(async () => {
  // Cerrar conexión
  await db.close();
});

beforeEach(async () => {
  // Limpiar datos antes de cada test
  await db.clear();
});

afterEach(async () => {
  // Limpiar después de cada test
  await db.clear();
});

// Crear datos de prueba
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  return await db.User.create({ ...defaultUser, ...userData });
};
```

### Testing de Autenticación

```typescript
describe('Authentication', () => {
  it('login exitoso retorna token', async () => {
    // Crear usuario
    await createTestUser({
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10)
    });
    
    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123'
      })
      .expect(200);
    
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('john@example.com');
  });
  
  it('login fallido con contraseña incorrecta', async () => {
    await createTestUser({
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10)
    });
    
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
  });
  
  it('accede a ruta protegida con token válido', async () => {
    const user = await createTestUser();
    const token = generateToken(user);
    
    await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

---

## Mejores Prácticas

### 1. AAA Pattern (Arrange, Act, Assert)

```typescript
it('debería incrementar contador', () => {
  // Arrange (Preparar)
  const { result } = renderHook(() => useCounter(0));
  
  // Act (Actuar)
  act(() => {
    result.current.increment();
  });
  
  // Assert (Verificar)
  expect(result.current.count).toBe(1);
});
```

### 2. Un Assert por Test (idealmente)

❌ **NO:**
```typescript
it('testea todo', () => {
  render(<Component />);
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
});
```

✅ **SÍ:**
```typescript
it('muestra texto A', () => {
  render(<Component />);
  expect(screen.getByText('A')).toBeInTheDocument();
});

it('muestra texto B', () => {
  render(<Component />);
  expect(screen.getByText('B')).toBeInTheDocument();
});
```

### 3. Nombres Descriptivos

```typescript
// ✅ Buenos nombres
describe('LoginForm', () => {
  it('muestra error cuando el email es inválido', () => {});
  it('deshabilita el botón mientras carga', () => {});
  it('redirige al dashboard después de login exitoso', () => {});
});

// ❌ Malos nombres
describe('LoginForm', () => {
  it('test 1', () => {});
  it('funciona correctamente', () => {});
  it('login', () => {});
});
```

### 4. No Testear Implementación, Testear Comportamiento

❌ **NO:**
```typescript
// Testea implementación (cómo lo hace)
it('llama a setState con true', () => {
  const setState = jest.fn();
  component.handleClick();
  expect(setState).toHaveBeenCalledWith(true);
});
```

✅ **SÍ:**
```typescript
// Testea comportamiento (qué hace)
it('muestra mensaje de éxito al hacer clic', async () => {
  render(<Component />);
  await userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Éxito')).toBeInTheDocument();
});
```

### 5. Usar data-testid como Último Recurso

```typescript
// ✅ Primero intentar roles y texto
screen.getByRole('button', { name: /enviar/i });
screen.getByLabelText(/email/i);

// ❌ Evitar testid si es posible
screen.getByTestId('submit-button');
```

### 6. Limpiar después de cada test

```typescript
afterEach(() => {
  // Limpiar mocks
  jest.clearAllMocks();
  
  // Limpiar DOM
  cleanup();
  
  // Limpiar localStorage
  localStorage.clear();
});
```

---

## Casos Comunes

### Testing de Loading States

```typescript
it('muestra spinner mientras carga', () => {
  render(<UserList />);
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
});

it('oculta spinner después de cargar', async () => {
  render(<UserList />);
  await waitFor(() => {
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });
});
```

### Testing de Errores

```typescript
it('muestra mensaje de error', async () => {
  // Mock de error
  jest.spyOn(api, 'fetchUsers').mockRejectedValue(new Error('Network error'));
  
  render(<UserList />);
  
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

### Testing de Eventos

```typescript
it('filtra resultados al escribir', async () => {
  render(<UserList users={users} />);
  
  await userEvent.type(screen.getByPlaceholderText(/buscar/i), 'John');
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
});
```

---

## Ejemplos Prácticos

### Ejemplo Completo: Componente de Login

```typescript
// LoginForm.tsx
export function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }
    onSubmit({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div role="alert">{error}</div>}
      
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      
      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
    </form>
  );
}

// LoginForm.test.tsx
describe('LoginForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  it('renderiza formulario', () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
  
  it('muestra error cuando campos están vacíos', async () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(screen.getByRole('alert')).toHaveTextContent(/todos los campos/i);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  it('envía datos cuando formulario es válido', async () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
    await userEvent.click(screen.getByRole('button'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  it('deshabilita botón durante carga', () => {
    render(<LoginForm onSubmit={mockSubmit} loading={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(/cargando/i);
  });
  
  it('limpia error cuando usuario empieza a escribir', async () => {
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    // Mostrar error
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Limpiar error
    await userEvent.type(screen.getByLabelText(/email/i), 'a');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
```

---

## Comandos Útiles

```bash
# Frontend
npm test                    # Ejecutar tests
npm run test:watch         # Modo watch
npm run test:coverage      # Con cobertura
npm run test:components    # Solo componentes
npm run test -- --grep "Login"  # Filtrar por nombre

# Backend
npm test                   # Ejecutar tests
npm run test:watch        # Modo watch
npm run test:coverage     # Con cobertura
npm run test:auth         # Solo auth
npm run test:users        # Solo users

# Verbosidad
npm test -- --verbose     # Más detalle
npm test -- --silent      # Menos detalle
```

---

## Recursos

- 📚 [Testing Library Docs](https://testing-library.com/docs/)
- 📚 [Jest Docs](https://jestjs.io/docs/getting-started)
- 📚 [Supertest Docs](https://github.com/visionmedia/supertest)
- 🎥 [Testing React Apps](https://testingjavascript.com/)

---

**¿Dudas?** Revisa los tests existentes en el proyecto como ejemplos reales.
