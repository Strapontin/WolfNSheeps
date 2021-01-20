import re


def get_user_name(request):
    # A user will be an ip address and the browser info. Two browsers on a same computer are two players
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    user = ip + request.META['HTTP_USER_AGENT']

    return user


def get_user_color(request, room):

    user = get_user_name(request)
    user_color = ''

    # Determines the color used by the user
    if room.creator == user:
        user_color = room.creator_color
    elif room.second_player == user:
        if room.creator_color == "White":
            user_color = "Black"
        else:
            user_color = "White"

    return user_color


# def check_victory(position):
#     # In order to check the victory conditions, we first need to recreate the board virtually to check if either the
#     # wolf has pass or cannot move anymore
#     positions = re.findall(r'\w{1,8}', position)
#
#     print(positions)
#
#     for line in positions:
#         print(line)
#         line_array = []
#         for cell in line:
#             print(cell)
