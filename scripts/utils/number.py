""" Number utilities. """

def suffix(d: int) -> str:
  """ Returns the suffix of a number. """
  return 'th' if 11<=d<=13 else {1:'st',2:'nd',3:'rd'}.get(d%10, 'th')
