import { createSignal, onMount, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [generatedNames, setGeneratedNames] = createSignal([]);
  const [favoriteNames, setFavoriteNames] = createSignal([]);
  const [gender, setGender] = createSignal('Male');
  const [loading, setLoading] = createSignal(false);

  const fetchFavoriteNames = async () => {
    try {
      const response = await fetch('/api/getFavoriteNames');
      if (response.ok) {
        const data = await response.json();
        setFavoriteNames(data);
      } else {
        console.error('Error fetching favorite names:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching favorite names:', error);
    }
  };

  onMount(fetchFavoriteNames);

  const generateNames = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a list of 10 unique and beautiful ${gender().toLowerCase()} child names in JSON array format, e.g., ["Name1", "Name2", ...]`;
      const result = await createEvent('chatgpt_request', {
        prompt,
        response_type: 'json',
      });
      setGeneratedNames(result);
    } catch (error) {
      console.error('Error generating names:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavoriteName = async (name, gender) => {
    try {
      const response = await fetch('/api/saveFavoriteName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, gender }),
      });
      if (response.ok) {
        setFavoriteNames([...(favoriteNames() || []), { name, gender }]);
      } else {
        console.error('Error saving favorite name:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving favorite name:', error);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-900">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-purple-600 text-center mb-8">New Child</h1>
        <div class="flex flex-col items-center space-y-6">
          <div class="flex space-x-4 mb-4">
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender() === 'Male'}
                onChange={() => setGender('Male')}
                class="form-radio h-5 w-5 text-purple-600 cursor-pointer"
              />
              <span class="ml-2">Male</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender() === 'Female'}
                onChange={() => setGender('Female')}
                class="form-radio h-5 w-5 text-purple-600 cursor-pointer"
              />
              <span class="ml-2">Female</span>
            </label>
          </div>
          <button
            class={`px-8 py-4 bg-purple-500 text-white rounded-full shadow-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 ${
              loading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={generateNames}
            disabled={loading()}
          >
            <Show when={!loading()} fallback={<span>Generating...</span>}>
              Generate Names
            </Show>
          </button>

          <Show when={generatedNames() && generatedNames().length > 0}>
            <div class="w-full">
              <h2 class="text-2xl font-bold text-purple-600 mb-4">Generated Names</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <For each={generatedNames()}>
                  {(name) => (
                    <div class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                      <div>
                        <span class="font-semibold">{name}</span>
                        <span class="text-sm text-gray-500 ml-2">({gender()})</span>
                      </div>
                      <button
                        class="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        onClick={() => saveFavoriteName(name, gender())}
                      >
                        Save as Favorite
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={favoriteNames() && favoriteNames().length > 0}>
            <div class="w-full">
              <h2 class="text-2xl font-bold text-purple-600 mt-8 mb-4">Favorite Names</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <For each={favoriteNames()}>
                  {(item) => (
                    <div class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                      <div>
                        <span class="font-semibold">{item.name}</span>
                        <span class="text-sm text-gray-500 ml-2">({item.gender})</span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;