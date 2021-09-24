import re, sys, io, hgtk, datetime

def getKoreanText(log_file: str) -> str:
    """ 
    :extract only korean text from log_file
    :param: log file path
    :return: korean str
    """

    # open log file
    reader = io.open(log_file, 'r', encoding='utf-8')

    # korean regex
    regex_korean = re.compile('[^가-힣]+')
    regex_filter = re.compile('[가-힣]+')

    # read all line
    fileLines = reader.readlines()
    result = ""

    for line in fileLines:
        # if only one korean in line
        if regex_filter.findall(line):
            # get line
            result+=str(line)

    # extract korean and space

    return result

if __name__== "__main__":
    src = sys.argv[1]

    korean_result = getKoreanText(src)
    print(korean_result)

