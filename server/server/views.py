# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai

openai.api_key = 'your_openai_api_key'

@csrf_exempt
def generate_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        prompt = data.get('prompt')
        if prompt:
            response = generate_response(prompt)
            return JsonResponse({'response': response})
        else:
            return JsonResponse({'error': 'Prompt is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

def generate_response(prompt):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()
