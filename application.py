from helpers import *

# configure application
app = Flask(__name__)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# route user to /compute
@app.route("/")
def index():
    return redirect(url_for("compute"))

# route user to /compute
@app.route("/compute", methods=["GET"])
def compute():
        return render_template("compute.html")

# route user to appropriate page on visting /computed
# Actual page only accesible through POST. Redirects to /compute on visiting through POST.
@app.route("/computed", methods=["GET", "POST"])
def computed():

    if request.method == "POST":
        session.pop('_flashes', None)

        if "c" in request.form: 
            return render_computed(1)
        else:
            return render_computed(0)
    
    # redirect user to /computer if not reached via POST
    else: 
        return redirect(url_for("compute"))

# run flask on port 2525 on compilation
if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.run( 
        host="0.0.0.0",
        port=int("2525"), 
        debug=True
    )


