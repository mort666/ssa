class TargetsController < ApplicationController
	def index
		if user_signed_in?
			render :layout => false
		else
			render nothing: true
		end
	end

	def edit
		if user_signed_in?
			@target = current_user.targets.where(["shorttitle = ?",params[:title]]).select("title, shorttitle, updated_at, created_at, smt, pct, egt, tat, srt, sat, drt, crt, stt, vmt, eht, oet").limit(1).first
			render :layout => false
		else
			render nothing: true
		end
	end

	def fetch
		if user_signed_in?
			render :status => 200, :json => current_user.targets.select("title, shorttitle, updated_at, created_at, smt, pct, egt, tat, srt, sat, drt, crt, stt, vmt, eht, oet").order("id ASC").to_json
		else
			render :status => 200, :json => { :error => "error" }
		end
	end

	def create
		if user_signed_in?
			current_user.targets.create(
				:title => params[:target][:title],
				:shorttitle => params[:target][:title].downcase.gsub(/[^0-9a-z ]/i,'').gsub(/\s+/, ""),
				:smt => params[:target][:smt],
				:pct => params[:target][:pct],
				:egt => params[:target][:egt],
				:tat => params[:target][:tat],
				:srt => params[:target][:srt],
				:sat => params[:target][:sat],
				:drt => params[:target][:drt],
				:crt => params[:target][:crt],
				:stt => params[:target][:stt],
				:vmt => params[:target][:vmt],
				:eht => params[:target][:eht],
				:oet => params[:target][:oet]
			)
			render :status => 200, :json => { :error => "success" }
		else
			render :status => 200, :json => { :error => "error" }
		end
	end

	def update
		if user_signed_in?
			tgt = current_user.targets.find_by_shorttitle(params[:target][:shorttitle])
			tgt.smt = params[:target][:smt]
			tgt.pct = params[:target][:pct]
			tgt.egt = params[:target][:egt]
			tgt.tat = params[:target][:tat]
			tgt.srt = params[:target][:srt]
			tgt.sat = params[:target][:sat]
			tgt.drt = params[:target][:drt]
			tgt.crt = params[:target][:crt]
			tgt.stt = params[:target][:stt]
			tgt.vmt = params[:target][:vmt]
			tgt.eht = params[:target][:eht]
			tgt.oet = params[:target][:oet]
			tgt.save
			render :status => 200, :json => { :error => "success" }
		else
			render :status => 200, :json => { :error => "success" }
		end
	end



	def delete
		if user_signed_in?
			current_user.targets.find_by_shorttitle(params[:target]).destroy
			render :status => 200, :json => { :error => "success" }
		else
			# Return success anyway
			render :status => 200, :json => { :error => "success" }
		end
	end
end