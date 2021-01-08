from django.shortcuts import redirect


def redirect_to_chat(request):
    response = redirect('board/')
    return response
