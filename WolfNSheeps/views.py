from django.shortcuts import redirect


def redirect_to_home_page(request):
    response = redirect('home/')
    return response
