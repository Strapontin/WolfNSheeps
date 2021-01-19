def get_user_name(request):
    # A user will be an ip address and the browser info. Two browsers on a same computer are two players
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    creator = ip + request.META['HTTP_USER_AGENT']

    return creator


def get_user_color(request, room):
    # Determines the color used by the user
    if room.creator == get_user_name(request):
        user_color = room.creator_color
    else:
        if room.creator_color == "White":
            user_color = "Black"
        else:
            user_color = "White"

    return user_color
